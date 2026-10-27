function validarReemplazoReserva(req, res, next) {
    const datos = req.body;
    const permitidos = [
        "estudiante",
        "email",
        "sala",
        "fecha",
        "turno",
        "personas",
        "disponible",
    ];
    for (const campo of Object.keys(datos)) {
        if (!permitidos.includes(campo)) {
            return res
                .status(400)
                .json({ error: "El campo " + campo + " no se puede modificar." });
        }
    }
    if (typeof datos.disponible !== "boolean") {
        return res.status(400).json({ error: "Disponible debe ser true o false." });
    }
    /*
        req.cambiosValidos = req.reservaValidada;
    
    */
    req.cambiosValidos = { ...req.reservaValidada };
    req.cambiosValidos.disponible = datos.disponible;
    next();
}

function validarActualizacionReserva(req, res, next) {
    const datos = req.body;
    if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
        return res.status(400).json({ error: "Enviá un objeto JSON." });
    }
    for (const campo of Object.keys(datos)) {
        if (campo !== "personas" && campo !== "disponible") {
            return res
                .status(400)
                .json({ error: "Solo se puede cambiar Cant. de Personas o disponible." });
        }
    }
    if (datos.personas === undefined && datos.disponible === undefined) {
        return res.status(400).json({ error: "Enviá personas o disponible." });
    }
    const cambios = {};
    if (datos.personas !== undefined) {
        if (typeof datos.personas !== "number") {
            return res
                .status(400)
                .json({ error: "Personas debe ser un número JSON, sin comillas." });
        }
        if (!Number.isFinite(datos.personas) || datos.personas < 1 || datos.personas > 6) {
            return res
                .status(400)
                .json({ error: "Personas debe ser mayor o igual a 1 y Menor que 7." });
        }
        cambios.personas = datos.personas;
    }
    if (datos.disponible !== undefined) {
        if (typeof datos.disponible !== "boolean") {
            return res
                .status(400)
                .json({ error: "Disponible debe ser true o false." });
        }
        cambios.disponible = datos.disponible;
    }
    req.cambiosValidos = cambios;
    next();
}
module.exports = { validarReemplazoReserva, validarActualizacionReserva };

/*
function validarCambioReserva(req, res, next) {
    const cuerpo = req.body;
    const rechazar = () =>
        res.status(400).json({ error: "Revisá los campos de la actualización." });
    if (!cuerpo || typeof cuerpo !== "object" || Array.isArray(cuerpo)) {
        return rechazar();
    }
    const esPut = req.method === "PUT";
    const completos = [
        "estudiante",
        "email",
        "sala",
        "fecha",
        "turno",
        "personas",
        "disponible",

    ];
    const permitidos = esPut ? completos : ["email", "disponible"];
    const claves = Object.keys(cuerpo);
    if (
        claves.length === 0 ||
        claves.some((clave) => !permitidos.includes(clave)) ||
        (esPut && completos.some((campo) => !Object.hasOwn(cuerpo, campo)))
    )
        return rechazar();
    const datos = {};
    for (const campo of claves) {
        const valor = cuerpo[campo];
        if (campo === "email") {
            const tipoValido =
                typeof valor === "number" ||
                (typeof valor === "string" && valor.trim() !== "");
            const numero = tipoValido ? Number(valor) : NaN;
            if (!Number.isFinite(numero) || numero < 1) return rechazar();
            datos[campo] = numero;
        } else if (campo === "disponible") {
            if (typeof valor !== "boolean") return rechazar();
            datos[campo] = valor;
        } else {
            if (typeof valor !== "string" || !valor.trim()) return rechazar();
            datos[campo] = valor.trim();
        }
    }
    req.cambiosValidos = datos;
    next();
}
module.exports = { validarCambioReserva };
*/