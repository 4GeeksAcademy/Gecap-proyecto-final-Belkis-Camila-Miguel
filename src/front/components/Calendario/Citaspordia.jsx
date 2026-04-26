import React, { useState, useEffect } from "react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import ModalCitas from "./ModalCitas";


const CitasPorDia = ({ fechaSeleccionada, onAgregarCita, onEliminarCita, pacientesHoy, onActualizarCita, seleccionarVista }) => {

    const [calendar, setCalendar] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
    const [mostratModal, setMostrarModal] = useState(false);
    const [seleccionarCita, setSeleccionarCita] = useState(null);



    const [formData, setFormData] = useState({
        nombre: "",
        telefono: "",
        motivo: "",
        otroMotivo: ""
    });

    useEffect(() => {
        if (!calendar || calendar.disposed())
            return;

        calendar.update({
            viewType: seleccionarVista,
            startDate: new DayPilot.Date(fechaSeleccionada),
            columns: seleccionarVista === "Day" ? [{ name: "Agenda Médica", id: "C1" }] : undefined,
            events: pacientesHoy.map(p => ({
                id: p.id,
                text: `${p.nombre || p.patient_name || "Paciente"} - ${p.motivo || p.reason || "Consulta"}`,
                start: p.start,
                end: p.end,
                status: p.status,
                backColor: p.status === "asistio" ? "#6e8d90" : p.status === "no asistio" ? "#a66d6d" : "#8184d6"
            })),

        });
    }, [calendar, fechaSeleccionada, pacientesHoy, seleccionarVista]);


    const handleGuardarCita = () => {
        if (!formData.nombre.trim()) {
            alert("El nombre es obligatorio");
            return;
        }

        if (formData.telefono.length !== 9) {
            alert("El teléfono debe tener 9 números");
            return;
        }
        const motivoFinal =
            formData.motivo === "Otro"
                ? formData.otroMotivo
                : formData.motivo;

        if (!motivoFinal.trim()) {
            alert("El motivo de consulta es obligatorio");
            return;
        }


        const nuevaCita = {
            id: DayPilot.guid(),
            text: `${formData.nombre} - ${motivoFinal}`,
            start: selectedRange.start,
            end: selectedRange.end,
            backColor: "#93bbbf",
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
            status: "pendiente",
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
        viewType: seleccionarVista,
        headerDateFormat: "dd/MM/yyyy",
        columns: seleccionarVista === "Day" ? [{ name: "Agenda Médica", id: "C1" }] : undefined,
        timeRangeSelectedHandling: "Enabled",
        eventResizeHandling: "Update", 
        eventMoveHandling: "Update",
        headerHeight: 50,
        cellHeight: 40,
        theme: "calendar_default",
        durationBarVisible: false,
        onEventResized: (args) => {
        onActualizarCita(args.e.id(), {
            ...args.e.data,
            start: args.newStart,
            end: args.newEnd,
            date: args.newStart.toString() 
        });
    },
        onEventClick: async (args) => {
            const e = args.e;
            args.originalEvent.stopPropagation();
            const datosPaciente = pacientesHoy.find(p => p.id === e.id());
            setSeleccionarCita(datosPaciente);
            setMostrarModal(true);
        },
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
                args.data.backColor = "#93bbbf";
            }
            args.data.borderColor = "darker";
            args.data.fontColor = "white";
            args.data.areas = [                
              {
            left: 0,
            right: 0,
            bottom: 5,
            height: 20,
            text: args.data.status?.toUpperCase(),
            style: `
                text-align: center; 
                font-size: 10px; 
                font-weight: bold; 
                letter-spacing: 1px;
                background-color: rgba(255,255,255,0.2);
                display: flex; 
                align-items: center; 
                justify-content: center;`
        },
                {
                    right: 5,
                    top: 8,
                    width: 18,
                    height: 18,
                    html: '<i class="fa-regular fa-trash-can"></i>',
                    style: "cursor:pointer;font-size:20px; background-color: rgba(0,0,0,0.2); border-radius: 50%; text-align: center; line-height: 18px;",
                    onClick: (argsArea) => {
                        argsArea.originalEvent.stopPropagation();
                        onEliminarCita(argsArea.source.id());
                    }
                },
                {
                    right: 28,
                    top: 8,
                    width: 18,
                    height: 18,
                    html: '<i class="fa-solid fa-pen-to-square"></i>',
                    style: "cursor:pointer; font-size:18px; background-color: rgba(0,0,0,0.2); border-radius: 50%; text-align: center; line-height: 20px;",
                    onClick: async (argsArea) => {
                        argsArea.originalEvent.stopPropagation();
                        const citaActual = argsArea.source.data;

                        const nombreActual = citaActual.text?.split(" - ")[0] || "";
                        const motivoActual = citaActual.text?.split(" - ")[1] || "";

                        const modalNombre = await DayPilot.Modal.prompt("Editar nombre:", nombreActual);
                        if (modalNombre.canceled || !modalNombre.result) return;
                        const modalMotivo = await DayPilot.Modal.prompt("Editar motivo:", motivoActual);
                        if (modalMotivo.canceled || !modalMotivo.result) return;
                        console.log(citaActual)

                        onActualizarCita(citaActual.id, {
                            date: new Date(citaActual.start).toISOString(),
                            ...citaActual,
                            nombre: modalNombre.result,
                            reason: modalMotivo.result,
                            status: citaActual.status,

                        });
                    }
                }
            ];
        }
    };
    return (
        <div className="mt-3 border rounded shadow-sm overflow-hidden">
            <DayPilotCalendar {...config} controlRef={setCalendar} />
            {mostratModal && (
                <ModalCitas cita={seleccionarCita}
                    onClose={() => setMostrarModal(false)}
                    onActualizarCita={onActualizarCita}
                    pacientesHoy={pacientesHoy}
                />
            )}

            {showModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 9999
                }}>
                    <div style={{
                        background: "white",
                        padding: "20px",
                        borderRadius: "10px",
                        minWidth: "320px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px"
                    }}>
                        <h3>Nueva cita</h3>

                        <input
                            type="text"
                            placeholder="Nombre"
                            value={formData.nombre}
                            onChange={(e) =>
                                setFormData({ ...formData, nombre: e.target.value })
                            }
                        />

                        <input
                            type="tel"
                            placeholder="Teléfono"
                            value={formData.telefono}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    telefono: e.target.value.replace(/\D/g, "").slice(0, 9)
                                })
                            }
                        />

                        <select
                            value={formData.motivo}
                            onChange={(e) =>
                                setFormData({ ...formData, motivo: e.target.value })
                            }
                        >
                            <option value="">Selecciona un motivo</option>
                            <option value="Pediatra">Pediatra</option>
                            <option value="Revisión">Revisión</option>
                            <option value="Consulta general">Consulta general</option>
                            <option value="Urgencia">Urgencia</option>
                            <option value="Control">Control</option>
                            <option value="Otro">Otro</option>
                        </select>

                        {formData.motivo === "Otro" && (
                            <input
                                type="text"
                                placeholder="Escribe el motivo"
                                value={formData.otroMotivo}
                                onChange={(e) =>
                                    setFormData({ ...formData, otroMotivo: e.target.value })
                                }
                            />
                        )}

                        <div style={{
                            display: "flex",
                            gap: "10px",
                            justifyContent: "flex-end",
                            marginTop: "10px"
                        }}>
                            <button onClick={handleGuardarCita}>Guardar</button>
                            <button onClick={() => {
                                setShowModal(false);
                                setFormData({
                                    nombre: "",
                                    telefono: "",
                                    motivo: "",
                                    otroMotivo: ""
                                });
                            }}>
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