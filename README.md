# tp-09-salas-crud-mongodb


1. Origen de la copia
    El presente trabajo práctico se desarrolló a partir de una copia funcional del TP08.

    Proyecto base: tp-08-salas-http-mongodb

2. Tecnologías y versiones
        ├── @eslint/js@10.0.1
        ├── ejs@6.0.1
        ├── eslint@10.12.0
        ├── express-ejs-layouts@2.5.1
        ├── express@5.2.1
        ├── mongoose@9.10.3
        ├── morgan@1.12.1
        └── prettier@3.9.9

3. Preparación de MongoDB Atlas
    Se Crea la base de datos:
        reservas_salas_u9
            |-> Coleccion: reservas

    Ya existe usario en Base de Datos creado anteriormente.
    Se obtuvo Cadena de conexion que se agrego a MONGODB_URI en valriables de entorno .env 
    Se configura la variable MONGODB_URI con cadena de conexion, usuario y contraseña.

4. Configuración del entorno
    Archivo .env basado en .env

    PORT=3000
    NODE_ENV=development
    MONGODB_URI="mongodb+srv://usuario:password@cluster0.ggyk4zc.mongodb.net/reservas_salas_u9?retryWrites=true&w=majority&appName=Cluster0"

    Las credenciales de acceso y cadenas de conexión no se publican en el repositorio. Las mismas se gestionan mediante variables de entorno y se distribuyen por canales privados.

5. Diagnostico DSNS Resolutores utilizados

    MongoDB Atlas utiliza registros DNS de tipo SRV y TXT para resolver las cadenas de conexión con prefijo mongodb+srv://. Durante el desarrollo se incorporó la configuración recomendada en la consigna dentro de src/config/base-datos.js:

    const dns = require("node:dns");
    dns.setServers(["8.8.8.8", "1.1.1.1"]);

6. Inicio
    * Instalación
    npm install

    * Inicio
    npm start

    * Servidor:
    http://localhost:3000
    
7. Capas.
        tp-09-salas-crud-mongodb/
        │
        ├── src/
        │ │
        │ ├── config/
        │ │ ├── entorno.js
        │ │ └── base-datos.js
        │ │
        │ ├── controladores/
        │ │ └── reservas.js
        │ │
        │ ├── middleware/
        │ │ └── cambios-reservas.js        
        │ │ └── errores.js
        │ │ └── reservas.js
        │ │ └── solicitudes.js
        │ │
        │ ├── modelos/
        │ │ └── reserva.js
        │ │
        │ ├── rutas/
        │ │ └── reservas-api.js   
        │ │ └── reservas.js        
        │ │
        │ ├── servicios/
        │ │ └── reservas-mongo.js    
        │ │ └── reservas.js        
        │ │
        │ ├── app.js
        │ └── index.js
        │
        ├── scripts/
        │ ├── comprobar-conexion.js
        │ ├── crear-reserva.js
        │ └── listar-reservas.js
        │ └── validar-reserva.js        
        │
        ├── vistas/
        │
        ├── .env
        ├── .gitignore
        ├── eslint.config.js
        ├── package.json
        ├── package-lock.json
        └── README.md


8. Validaciones Generales (POST / PUT)
    Para que una reserva sea considerada válida, debe cumplir simultáneamente las siguientes restricciones de negocio:
    * **Estudiante:** Cadena de texto no vacía.
    * **Email:** Debe ser un correo electrónico válido que contenga explícitamente el carácter `@`.
    * **Fecha / Turno:** El turno debe pertenecer estrictamente a las opciones: `Mañana`, `Tarde` o `Noche`.
    * **Sala:** Debe ser un recurso existente en el catálogo cerrado: `Sala Norte`, `Sala Sur` o `Sala Multimedia`.
    * **Cantidad de Personas:** Debe ser obligatoriamente un número entero JSON (sin comillas), mayor o igual a 1 y menor o igual a 6.
    * **Estado:** Campo restrictivo que sólo admite los valores lógicos: `Pendiente` o `Confirmada`.

9. Restricciones Específicas de Modificación (PATCH)
    Al realizar modificaciones parciales se ejecutan validaciones exclusivas de la capa de control de cambios:
    * El cuerpo (`body`) de la petición debe ser obligatoriamente un objeto JSON.
    * Se genera un rechazo inmediato (`400 Bad Request`) si se intentan enviar campos sensibles o estructurales (como alterar el nombre del estudiante, congelar la sala o redefinir la fecha).


10. Matriz Observada (Flujo de Validaciones y Estados)

A continuación, se detalla una matriz conceptual que representa el comportamiento del backend frente al estado de la solicitud entrante y los campos suministrados:

| Método | Campos Suministrados en el Body | Validación Middleware | Acción del Servidor / Código de Respuesta |
| :--- | :--- | :--- | :--- |
| **POST / PUT** | Todos los campos válidos (`personas` entre 1 y 6, email con `@`) |  Pasa | Inserta/Reemplaza en DB. Retorna `201 Created` / `200 OK`. |
| **POST / PUT** | Campos faltantes o fuera de rango (ej: `personas: 8`) |  Falla | No toca la DB. Responde inmediatamente con `400 Bad Request`. |
| **POST / PUT** | Email sin carácter `@` |  Falla | No toca la DB. Responde con `400 Bad Request` ("Email inválido"). |
| **PUT** | Intento de enviar una propiedad no estructural o extraña |  Falla | Bloqueo preventivo. Responde con `400 Bad Request`. |
| **PATCH** | Intento de modificar `estudiante`, `sala`, `fecha` o `email` |  Falla | Bloqueo por contrato. Responde `400` ("Solo se puede cambiar Cant. de Personas o Estado."). |
| **PATCH** | Modificación válida de `personas` (ej: de 2 a 5) o de `estado` |  Pasa | Ejecuta `$set` parcial en Mongoose. Retorna `200 OK` con el cambio. |
| **CUALQUIERA**| ID malformado o que no cumple formato de ObjectId |  Falla | Interceptado por `comprobarId()`. Lanza excepción controlada `ID_INVALIDO`. |

---
11. Criterio de Borrado

    El sistema implementa un **Criterio de Borrado Físico** (Hard Delete). Al invocar con éxito el endpoint `DELETE /api/reservas/:id`, la capa de servicios se comunica con el driver de base de datos ejecutando el comando nativo `Reserva.deleteOne({ _id: id })`. 
    Dado que las reservas representan ocupaciones físicas puntuales de espacios comunes, una cancelación definitiva se traduce en la eliminación estructural del documento para liberar almacenamiento en las colecciones y optimizar las consultas de disponibilidad en tiempo real.

12. EVIDENCIAS
    Las evidencias se cargan en archivo docs/evidencias subido en url presentada.