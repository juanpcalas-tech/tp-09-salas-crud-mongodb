function prepararAreaReservas(req, res, next) {
    res.locals.seccion = "Reserva Salas";
    next();
}
function validarDatosReserva(req, res, next) {
    const valores = req.body ?? {};
    const estudiante = typeof valores.estudiante === "string" ? valores.estudiante.trim() : "";
    const email = typeof valores.email === "string" ? valores.email.trim() : "";
    const fecha = typeof valores.fecha === "string" ? valores.fecha.trim() : "";
    const turno = typeof valores.turno === "string" ? valores.turno.trim() : "";
    const sala = typeof valores.sala === "string" ? valores.sala.trim() : "";
    const tipovalido = typeof valores.personas === "number" || (typeof valores.personas === "string" && valores.personas.trim() !=="");
    const personas = tipovalido ?  Number(valores.personas) : NaN;
    const salasDisponibles = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
    const turnosDisponibles = ["Mañana", "Tarde", "Noche"];

    const valoresLimpios = { estudiante, email, fecha, turno, sala, personas };

    if (
        !estudiante ||
        !email ||
        !fecha ||
        !turnosDisponibles.includes(turno) ||
        !salasDisponibles.includes(sala) ||
        !Number.isInteger(personas) ||
        personas < 1 ||
        personas > 6
    ) {
        if (req.baseUrl === "/api/reservas") {
            return res
            .status(400)
            .json({error: "Revisa los Datos de la Reserva",});
        }
        return res.status(400).render("reservas/nueva", {
            titulo: "Nueva Reserva",
            error: "Revisa los Datos de la Reserva",
            valores: valoresLimpios
        });
    }

    if (!email.includes("@")) {
        if (req.baseUrl === "/api/reservas") {
            return res.status(400).json({
                error: "Email inválido"
            });
        }
        return res.status(400).render("reservas/nueva", {
            titulo: "Nueva Reserva",
            error: "El correo electrónico debe contener el carácter '@'.",
            valores: valoresLimpios
        });
    }

    req.reservaValidada = valoresLimpios;

    next();
}
module.exports = { prepararAreaReservas, validarDatosReserva };


/*
function prepararAreaReservas(req, res, next) {
    res.locals.seccion = "Reserva Salas";
    next();
}
function validarDatosReserva(req, res, next) {
    const valores = req.body ?? {};
    const estudiante = typeof valores.estudiante === "string" ? valores.estudiante.trim() : "";
    const email = typeof valores.email === "string" ? valores.email.trim() : "";
    const fecha = typeof valores.fecha === "string" ? valores.fecha.trim() : "";
    const turno = typeof valores.turno === "string" ? valores.turno.trim() : "";
    const sala = typeof valores.sala === "string" ? valores.sala.trim() : "";
    const personas = Number(valores.personas);

    const salasDisponibles = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
    const turnosDisponibles = ["Mañana", "Tarde", "Noche"];

    if (!email.includes("@")) {
        return res.status(400).render("reservas/nueva", {
            titulo: "Nueva Reserva",
            error: "El correo electrónico debe contener el carácter '@'.",
            valores: { estudiante, email, fecha, turno, sala, personas: req.body.personas },
        });
    }
    if (
        !estudiante ||
        !email ||
        !fecha ||
        !turnosDisponibles.includes(turno) ||
        !salasDisponibles.includes(sala) ||
        !Number.isFinite(personas) ||
        personas < 1
    ) {
        if (req.baseUrl === "/api/reservas") {
            return res.status(400).json({
                error: "Completá los campos con un personas mayor o igual a 1.",
            });
        }
        return res.status(400).render("reservas/nueva", {
            titulo: "Nueva Reserva",
            error: "Completá los campos con personas mayor o igual a 1.",
            valores,
        });
    }
    req.reservaValidada = { estudiante, email, fecha, turno, sala, personas };
    next();
}
module.exports = { prepararAreaReservas, validarDatosReserva };
*/