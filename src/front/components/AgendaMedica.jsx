import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const AgendaMedica = () => {
    const listRef = useRef(null);
    const { store } = useGlobalReducer();
    const [showModal, setShowModal] = useState(false);
    const [nuevaCita, setNuevaCita] = useState({ pacienteId: "", fecha: "", hora: "", motivo: "" });
    const esMedico = store.role === "medico";

    const [events, setEvents] = useState([
        { id: "1", title: "Consulta Juan Pérez", start: "2026-04-15T10:00:00", end: "2026-04-15T11:00:00", backgroundColor: "#e8888c" },
        { id: "2", title: "Hueco Libre", start: "2026-04-15T12:00:00", end: "2026-04-15T13:00:00", backgroundColor: "#93bbbf" }
    ]);

    const handleEventClick = (info) => {

        const paciente = info.event.title;
        const hora = info.event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (paciente === "Hueco Libre") {
            alert(`Abriendo formulario para asignar cita a las ${hora}...`);

        } else {
            alert(`Accediendo a la ficha de: ${paciente}`);

        }
    };

    const handleDateSelect = (selectInfo) => {
        if (!esMedico) return;

        const fechaSeleccionada = selectInfo.startStr.split("T")[0];
        const horaSeleccionada = selectInfo.startStr.split("T")[1].substring(0, 5);

        setNuevaCita({
            ...nuevaCita,
            fecha: fechaSeleccionada,
            hora: horaSeleccionada
        });
        setShowModal(true);

        selectInfo.view.calendar.unselect();
    };

    return (
        <div className="container-fluid p-4 bg-light min-vh-100">
            <div className="row g-4">

                {/* COLUMNA IZQUIERDA: EL CALENDARIO */}
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="timeGridWeek"
                            headerToolbar={{
                                left: "prev,next today",
                                center: "title",
                                right: "dayGridMonth,timeGridWeek"
                            }}
                            selectable={esMedico}
                            selectMirror={true}
                            select={handleDateSelect}
                            events={events}
                            locale={esLocale}
                            events={events}
                            height="700px"
                            slotMinTime="08:00:00"
                            slotMaxTime="21:00:00"
                            allDaySlot={false}
                            eventClick={handleEventClick}
                            navLinks={true} 
                            navLinkDayClick={(date) => {
                                listRef.current.getApi().gotoDate(date); 
                            }}
                        />
                    </div>
                </div>

                {/* COLUMNA DERECHA: LISTA DE CONSULTAS (25% del ancho) */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white h-100">
                        <div className="p-3 border-bottom d-flex justify-content-between align-items-center" style={{ backgroundColor: "#566873" }}>
                            <h5 className="text-white mb-0 fw-bold small text-uppercase">
                                <i className="fas fa-clipboard-list me-2"></i>Consultas
                            </h5>
                            {/* FLECHAS DE NAVEGACIÓN */}
                            <div className="btn-group">
                                <button
                                    className="btn btn-sm text-white border-0"
                                    onClick={() => listRef.current.getApi().prev()}
                                >
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                                <button
                                    className="btn btn-sm text-white border-0 mx-1"
                                    style={{ fontSize: '0.7rem' }}
                                    onClick={() => listRef.current.getApi().today()}
                                >
                                    HOY
                                </button>
                                <button
                                    className="btn btn-sm text-white border-0"
                                    onClick={() => listRef.current.getApi().next()}
                                >
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                        <div className="p-2">
                            <FullCalendar
                                ref={listRef} 
                                plugins={[listPlugin]}
                                initialView="listDay"
                                headerToolbar={false}
                                locale={esLocale}
                                events={events}
                                height="640px"
                                noEventsContent="No hay consultas para este día"
                            />
                        </div>
                        <div className="p-3 bg-light text-center">
                            <button
                                className="btn btn-sm w-100 fw-bold text-white shadow-sm"
                                style={{ backgroundColor: "#e8888c", borderRadius: "10px" }}
                                onClick={() => setShowModal(true)}
                            >
                                + Nueva Cita
                            </button>
                        </div>
                    </div>
                </div>

            </div>
            {showModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow-lg">
                            <div className="modal-header border-0 text-white" style={{ backgroundColor: "#566873", borderRadius: "15px 15px 0 0" }}>
                                <h5 className="modal-title fw-bold"><i className="fas fa-calendar-plus me-2"></i>Nueva Cita Médica</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">BUSCAR PACIENTE (Nombre o DNI)</label>
                                    <select className="form-select border-0 bg-light shadow-sm p-3" style={{ borderRadius: "12px" }}
                                        onChange={(e) => setNuevaCita({ ...nuevaCita, pacienteId: e.target.value })}>
                                        <option value="">Seleccione un paciente...</option>
                                        {store.pacientes?.map(p => (
                                            <option key={p.id} value={p.id}>{p.nombre} ({p.dni})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label small fw-bold text-secondary">FECHA</label>
                                        <input type="date" className="form-control border-0 bg-light p-3" style={{ borderRadius: "12px" }}
                                            value={nuevaCita.fecha} onChange={(e) => setNuevaCita({ ...nuevaCita, fecha: e.target.value })} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label small fw-bold text-secondary">HORA</label>
                                        <input type="time" className="form-control border-0 bg-light p-3" style={{ borderRadius: "12px" }}
                                            value={nuevaCita.hora} onChange={(e) => setNuevaCita({ ...nuevaCita, hora: e.target.value })} />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">MOTIVO DE CONSULTA</label>
                                    <textarea className="form-control border-0 bg-light p-3" rows="3" style={{ borderRadius: "12px", resize: "none" }}
                                        placeholder="Ej: Revisión resultados analítica..."
                                        onChange={(e) => setNuevaCita({ ...nuevaCita, motivo: e.target.value })}></textarea>
                                </div>
                            </div>
                            <div className="modal-footer border-0 p-4 pt-0">
                                <button className="btn btn-light fw-bold px-4 py-2" style={{ borderRadius: "10px" }} onClick={() => setShowModal(false)}>Cancelar</button>
                                <button
                                    className="btn text-white fw-bold px-4 py-2 shadow-sm"
                                    style={{ backgroundColor: "#e8888c", borderRadius: "10px" }}
                                    onClick={() => {
                                        const pacienteSeleccionado = store.pacientes?.find(p => p.id == nuevaCita.pacienteId);
                                        const nombreMostrar = pacienteSeleccionado ? pacienteSeleccionado.nombre : "Paciente Desconocido";

                                        const citaParaCalendario = {
                                            id: Date.now().toString(),
                                            title: `Consulta: ${nombreMostrar}`,
                                            start: `${nuevaCita.fecha}T${nuevaCita.hora}:00`,
                                            end: `${nuevaCita.fecha}T${nuevaCita.hora}:00`,
                                            backgroundColor: "#e8888c",
                                            extendedProps: {
                                                paciente: nombreMostrar,
                                                motivo: nuevaCita.motivo
                                            }
                                        };

                                        setEvents([...events, citaParaCalendario]);
                                        setShowModal(false);
                                        setNuevaCita({ pacienteId: "", fecha: "", hora: "", motivo: "" });
                                    }}
                                >
                                    Confirmar Cita
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};