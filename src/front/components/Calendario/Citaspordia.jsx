import React, { useState, useEffect, useContext } from "react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import useStore from "../../hooks/useGlobalReducer";


const CitasPorDia = ({ fechaSeleccionada, onAgregarCita, onEliminarCita, pacientesHoy, onActualizarCita, abrirModalForzado, onModalAbierto }) => {

    const [calendar, setCalendar] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
    const { store, dispatch } = useStore();
    const [sugerencias, setSugerencias] = useState([]);

    const [formData, setFormData] = useState({
        nombre: "",
        telefono: "",
        fecha: new Date().toISOString().split('T')[0],
        hora: "10:00",
        motivo: "",
        otroMotivo: ""
    });

    useEffect(() => {
        if (!calendar || calendar.disposed()) return;

        calendar.update({
            startDate: new DayPilot.Date(fechaSeleccionada),
            events: pacientesHoy.map(p => {
                const limpiarHora = (horaStr) => {
                    if (!horaStr) return "09:00:00";

                    if (horaStr.includes("T")) return horaStr.split(".")[0].replace('Z', '');

                    let hLimpia = horaStr.toLowerCase().replace(/\s+/g, '');
                    let esPM = hLimpia.includes('p') || hLimpia.includes('tarde');
                    let esAM = hLimpia.includes('a') || hLimpia.includes('mañana');

                    let partes = hLimpia.replace(/[a-z. ]/g, '').split(':');
                    let h = parseInt(partes[0]);
                    let m = partes[1] ? partes[1].substring(0, 2) : "00";

                    if (esPM && h < 12) h += 12;
                    if (esAM && h === 12) h = 0;

                    return `${h.toString().padStart(2, '0')}:${m.padStart(2, '0')}:00`;
                };

                const fechaBase = p.date ? p.date.split('T')[0] : new DayPilot.Date(fechaSeleccionada).toString("yyyy-MM-dd");
                const inicioFinal = p.start && p.start.includes("T") ? p.start.split(".")[0] : `${fechaBase}T${limpiarHora(p.start)}`;
                const finFinal = p.end && p.end.includes("T") ? p.end.split(".")[0] : `${fechaBase}T${limpiarHora(p.end || p.start)}`;

                return {
                    id: p.id,
                    text: `${p.nombre || p.patient_name || "Paciente"} - ${p.reason || p.motivo || "Consulta"}`,
                    start: new DayPilot.Date(inicioFinal),
                    end: new DayPilot.Date(finFinal),
                    backColor: "#93bbbf",
                };
            }),
        });
    }, [calendar, fechaSeleccionada, pacientesHoy]);

    useEffect(() => {
        if (abrirModalForzado) {
            setFormData({
                nombre: "",
                telefono: "",
                motivo: "",
                otroMotivo: "",
                hora: "10:00"
            });
            setShowModal(true);
            onModalAbierto();
        }
    }, [abrirModalForzado]);

    const manejarBusqueda = (texto) => {
        setFormData({ ...formData, nombre: texto });
        if (texto.length > 1) {
            const filtrados = store.pacientes.filter(p =>
                `${p.nombre} ${p.apellidos}`.toLowerCase().includes(texto.toLowerCase())
            );
            setSugerencias(filtrados);
        } else {
            setSugerencias([]);
        }
    };

    const handleGuardarCita = async () => {
        const motivoFinal = formData.motivo === "Otro" ? formData.otroMotivo : formData.motivo;

        const citaParaEnviar = {
            patient_id: formData.patient_id,
            nombre: formData.nombre,
            telefono: formData.telefono,
            fecha: formData.fecha,
            hora: formData.hora,
            motivo: motivoFinal,
            start: selectedRange.start.toString(),
            end: selectedRange.end.toString()
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/appointment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(citaParaEnviar)
            });

            if (response.ok) {
                const data = await response.json();

                if (onAgregarCita) {
                    onAgregarCita(data.appointment || data);
                }

                setShowModal(false);
                alert("Cita guardada permanentemente en la base de datos");
            } else {
                const errorLog = await response.json();
                console.error("Error del servidor:", errorLog);
                alert("El servidor rechazó la cita. Revisa la consola del backend.");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
        }

        const nuevaCita = {
            id: DayPilot.guid(),
            text: `${formData.nombre} - ${motivoFinal}`,
            start: selectedRange.start,
            end: selectedRange.end,
            backColor: "#93c47d",
        };

        onAgregarCita({
            id: nuevaCita.id,
            nombre: formData.nombre,
            motivo: motivoFinal,
            telefono: formData.telefono,
            start: selectedRange.start,
            end: selectedRange.end,
            hora: new Date(selectedRange.start).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            }),
            reason: motivoFinal,
            patient_name: formData.nombre,
            status: "Active",
            date: new Date(selectedRange.start).toISOString()
        });

        setShowModal(false);

        setFormData({
            nombre: "",
            telefono: "",
            motivo: "",
            otroMotivo: ""
        });

        if (calendar) {
            calendar.clearSelection();
        }
    };

    const config = {
        viewType: "Day",
        headerDateFormat: "dd/MM/yyyy",
        columns: [{ name: "Agenda Médica", id: "C1" }],
        dayBeginsHour: 10,
        dayEndsHour: 21,
        businessBeginsHour: 10,
        businessEndsHour: 21,
        heightSpec: "BusinessHoursNoScroll",
        headerHeight: 50,
        cellHeight: 40,
        theme: "calendar_default",
        durationBarVisible: false,

        onTimeRangeSelected: async (args) => {
            setSelectedRange({
                start: args.start,
                end: args.end
            });

            setShowModal(true);

            if (calendar) {
                calendar.clearSelection();
            }

        },

        onBeforeEventRender: args => {
            if (!args.data.backColor) {
                args.data.backColor = "#93c47d";
            }

            args.data.borderColor = "darker";
            args.data.fontColor = "white";
            args.data.areas = [
                {
                    right: 5,
                    top: 8,
                    width: 18,
                    height: 18,
                    text: "X",
                    style: "cursor:pointer; background-color: rgba(0,0,0,0.2); border-radius: 50%; text-align: center; line-height: 18px;",
                    onClick: (argsArea) => {
                        onEliminarCita(argsArea.source.id());
                    }
                },
                {
                    right: 28,
                    top: 8,
                    width: 18,
                    height: 18,
                    text: "✎",
                    style: "cursor:pointer; background-color: rgba(0,0,0,0.2); border-radius: 50%; text-align: center; line-height: 18px;",
                    onClick: async (argsArea) => {
                        const citaActual = argsArea.source.data;

                        const nombreActual = citaActual.text?.split(" - ")[0] || "";
                        const motivoActual = citaActual.text?.split(" - ")[1] || "";

                        const modalNombre = await DayPilot.Modal.prompt("Editar nombre:", nombreActual);
                        if (modalNombre.canceled || !modalNombre.result) return;

                        const modalMotivo = await DayPilot.Modal.prompt("Editar motivo:", motivoActual);
                        if (modalMotivo.canceled || !modalMotivo.result) return;

                        onActualizarCita(citaActual.id, {
                            nombre: modalNombre.result,
                            motivo: modalMotivo.result,
                            reason: modalMotivo.result,
                            start: citaActual.start.toString(),
                            end: citaActual.end.toString(),
                            status: "Active",
                            date: new Date(citaActual.start).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            }),
                        });
                    }
                }
            ];
        }
    };

    return (
        <div className="mt-3 border rounded shadow-sm overflow-hidden">
            <DayPilotCalendar {...config} controlRef={setCalendar} />

            {showModal && (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                    background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center",
                    alignItems: "center", zIndex: 9999, backdropFilter: "blur(4px)"
                }}>
                    <div className="border-0 shadow-lg" style={{
                        background: "white", padding: "30px", borderRadius: "20px",
                        width: "100%", maxWidth: "450px", display: "flex", flexDirection: "column", gap: "15px"
                    }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h4 className="fw-bold mb-0" style={{ color: "#566873" }}>Agendar Cita</h4>
                            <button className="btn-close" onClick={() => setShowModal(false)}></button>
                        </div>

                        {/* SELECCIÓN DE PACIENTE (Dropdown + Input) */}
                        <div className="mb-1 position-relative">
                            <label className="form-label small fw-bold text-muted">PACIENTE</label>

                            {/* Selector de pacientes existentes */}
                            <select
                                className="form-select bg-light border-0 py-2 mb-2"
                                style={{ borderRadius: "10px", fontSize: "0.9rem" }}
                                value={formData.patient_id || ""}
                                onChange={(e) => {
                                    const idSel = e.target.value;
                                    if (idSel === "") {
                                        setFormData({ ...formData, nombre: "", patient_id: null, telefono: "" });
                                    } else {
                                        const p = store.pacientes.find(pac => (pac.id || pac.patient_id) == idSel);
                                        setFormData({
                                            ...formData,
                                            nombre: `${p.nombre} ${p.apellidos || ""}`,
                                            patient_id: p.id || p.patient_id,
                                            telefono: p.telefono || ""
                                        });
                                    }
                                }}
                            >
                                <option value="">-- Seleccionar paciente registrado --</option>
                                {store.pacientes && store.pacientes.map(p => (
                                    <option key={p.id || p.patient_id} value={p.id || p.patient_id}>
                                        {p.nombre} {p.apellidos || ""} {p.dni ? `(${p.dni})` : ""}
                                    </option>
                                ))}
                            </select>

                            {/* Input para búsqueda o paciente nuevo */}
                            <input
                                type="text"
                                className="form-control bg-light border-0 py-2"
                                style={{ borderRadius: "10px" }}
                                placeholder="O escribe para buscar/nuevo..."
                                value={formData.nombre || ""}
                                onChange={(e) => manejarBusqueda(e.target.value)}
                                autoComplete="off"
                            />

                            {/* Sugerencias de búsqueda manual */}
                            {sugerencias.length > 0 && (
                                <ul className="list-group position-absolute w-100 shadow-lg" style={{ zIndex: 1000, top: "100%", borderRadius: "10px" }}>
                                    {sugerencias.map(p => (
                                        <li
                                            key={p.id || p.patient_id}
                                            className="list-group-item list-group-item-action border-0 py-2"
                                            style={{ cursor: "pointer", fontSize: "0.9rem" }}
                                            onClick={() => {
                                                setFormData({
                                                    ...formData,
                                                    nombre: `${p.nombre} ${p.apellidos || ""}`,
                                                    telefono: p.telefono || "",
                                                    patient_id: p.id || p.patient_id
                                                });
                                                setSugerencias([]);
                                            }}
                                        >
                                            <i className="fas fa-user-circle me-2 text-muted"></i>
                                            {p.nombre} {p.apellidos || ""}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* FECHA */}
                        <div className="mb-1">
                            <label className="form-label small fw-bold text-muted">FECHA DE LA CITA</label>
                            <input
                                type="date"
                                className="form-control bg-light border-0 py-2"
                                style={{ borderRadius: "10px" }}
                                value={formData.fecha || ""}
                                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                            />
                        </div>

                        {/* TELÉFONO Y HORA */}
                        <div className="row">
                            <div className="col-md-7">
                                <label className="form-label small fw-bold text-muted">TELÉFONO</label>
                                <input
                                    type="tel"
                                    className="form-control bg-light border-0 py-2"
                                    style={{ borderRadius: "10px" }}
                                    placeholder="600 000 000"
                                    value={formData.telefono || ""}
                                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value.replace(/\D/g, "").slice(0, 9) })}
                                />
                            </div>
                            <div className="col-md-5">
                                <label className="form-label small fw-bold text-muted">HORA</label>
                                <input
                                    type="time"
                                    className="form-control bg-light border-0 py-2"
                                    style={{ borderRadius: "10px" }}
                                    value={formData.hora || "10:00"}
                                    onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* MOTIVO */}
                        <div className="mb-1">
                            <label className="form-label small fw-bold text-muted">MOTIVO DE CONSULTA</label>
                            <select
                                className="form-select bg-light border-0 py-2"
                                style={{ borderRadius: "10px" }}
                                value={formData.motivo || ""}
                                onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                            >
                                <option value="">Selecciona un motivo</option>
                                <option value="Pediatra">Pediatra</option>
                                <option value="Revisión">Revisión</option>
                                <option value="Consulta general">Consulta general</option>
                                <option value="Urgencia">Urgencia</option>
                                <option value="Control">Control</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>

                        {formData.motivo === "Otro" && (
                            <input
                                type="text"
                                className="form-control bg-light border-0 py-2 animate__animated animate__fadeIn"
                                style={{ borderRadius: "10px" }}
                                placeholder="Especifique el motivo"
                                value={formData.otroMotivo || ""}
                                onChange={(e) => setFormData({ ...formData, otroMotivo: e.target.value })}
                            />
                        )}

                        {/* BOTONES ACCIÓN */}
                        <div className="d-flex gap-2 mt-3">
                            <button
                                className="btn w-100 fw-bold text-white py-2 shadow-sm"
                                style={{ backgroundColor: "#93bbbf", borderRadius: "12px" }}
                                onClick={handleGuardarCita}
                            >
                                Guardar Cita
                            </button>
                            <button
                                className="btn w-100 fw-bold btn-light py-2"
                                style={{ borderRadius: "12px", color: "#566873" }}
                                onClick={() => {
                                    setShowModal(false);
                                    setFormData({ nombre: "", telefono: "", motivo: "", otroMotivo: "", hora: "10:00", fecha: new Date().toISOString().split('T')[0], patient_id: null });
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

};

export default CitasPorDia;