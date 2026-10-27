function crearControladorReservas(servicio) {
    async function listar(req, res) {
        const reservas = await servicio.listar();
        res.render("reservas/lista", {
            titulo: "Reserva Salas",
            reservas,
        });
    }
    function mostrarFormulario(req, res) {
        res.render("reservas/nueva", {
            titulo: "Nueva reserva",
            error: null,
            valores: {},
        });
    }
    async function mostrarDetalle(req, res) {
        const reserva = await servicio.obtenerPorId(req.params.id);
        if (!reserva) {
            return res.status(404).render("no-encontrado", {
                titulo: "Reserva no encontrada",
                mensaje: "No existe una reserva con ese identificador.",
            });
        }
        res.render("reservas/detalle", { titulo: reserva.estudiante, reserva});
    }
    async function crear(req, res) {
        await servicio.crear(req.reservaValidada);
        res.redirect("/reservas");
    }

async function estado(req, res) {
    const cantidad = await servicio.contar();
    res.status(200).json({
        servicio: "Activo",
        reservas: cantidad,
        idSolicitud: res.locals.idSolicitud,
    });
}    
    async function listarApi(req, res) {
        const reservas = await servicio.listar(req.query.sala);
        res.json(reservas);
    }
    /** Nuevo 22/10/2026 ***/
    /** Nuevo 22/10/2026 ***/
    async function obtenerApi(req, res) {
        const reserva = await servicio.obtenerPorId(req.params.id);
        if (!reserva) {
            return res.status(404).json({ error: "Reserva no encontrada." });
        }
        res.json(reserva);
    }
    async function crearApi(req, res) {
        const reserva = await servicio.crear(req.reservaValidada);
        res.location(`/api/reservas/${reserva.id}`).status(201).json(reserva);
    }
    async function eliminarApi(req, res) {
        const eliminado = await servicio.eliminar(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ error: "Recurso no encontrado." });
        }
        res.status(204).end();
    }

    async function reemplazarApi(req, res) {
        const reserva = await servicio.reemplazar(
            req.params.id,
            req.cambiosValidos,
        );
        if (!reserva) {
            return res.status(404).json({ error: "Recurso no encontrado." });
        }
        res.json(reserva);
    }

    async function actualizarApi(req, res) {
        const reserva = await servicio.actualizar(
            req.params.id,
            req.cambiosValidos,
        );
        if (!reserva) {
            return res.status(404).json({ error: "Recurso no encontrado." });
        }
        res.json(reserva);
    }
    return { listar, mostrarFormulario, mostrarDetalle, crear, estado, listarApi, obtenerApi, crearApi, eliminarApi, reemplazarApi, actualizarApi };
    /** Nuevo 22/10/2026 ***/
    /** Nuevo 22/10/2026 ***/

}
module.exports = { crearControladorReservas };


