import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const AgendaMedica = () => {
    const listRef = useRef(null);
    // 1. CORRECCIÓN: Extraer dispatch
    const { store, dispatch } = useGlobalReducer(); 
    const [showModal, setShowModal] = useState(false);
    const [nuevaCita, setNuevaCita] = useState({ pacienteId: "", fecha: "", hora: "", motivo: "" });
    const esMedico = store.role === "medico";

    // Manejo de clicks en eventos existentes
    const handleEventClick = (info) => {
        const paciente = info.event.title;
        alert(`Accediendo a la ficha de: ${paciente}`);
    };

    const handleDateSelect = (selectInfo) => {
        if (!esMedico) return;
        const fechaSeleccionada = selectInfo.startStr.split("T")[0];
        const horaSeleccionada = selectInfo.startStr.split("T")[1]?.substring(0, 5) || "09:00";

        setNuevaCita({ ...nuevaCita, fecha: fechaSeleccionada, hora: horaSeleccionada });
        setShowModal(true);
        selectInfo.view.calendar.unselect();
    };

    // 2. CORRECCIÓN: Carga de citas (una sola vez)
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/appointments`, {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    dispatch({ type: "set_appointments", payload: data });
                }
            } catch (error) {
                console.error("Error al cargar citas:", error);
            }
        };
        fetchAppointments();
    }, []);

    // 3. CORRECCIÓN: Una sola función de guardado limpia
    const handleGuardarCita = async () => {
        if (!nuevaCita.pacienteId || !nuevaCita.fecha || !nuevaCita.hora) {
            alert("Por favor, selecciona un paciente y el horario");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/appointments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    patient_id: parseInt(nuevaCita.pacienteId),
                    date: nuevaCita.fecha,
                    time: nuevaCita.hora,
                    reason: nuevaCita.motivo
                })
            });

            if (response.ok) {
                const data = await response.json();
                dispatch({
                    type: "set_appointments",
                    payload: [...(store.appointments || []), data.appointment]
                });
                setShowModal(false);
                setNuevaCita({ pacienteId: "", fecha: "", hora: "", motivo: "" });
                alert("✅ Cita guardada correctamente");
            } else {
                const error = await response.json();
                alert("Error: " + (error.msg || "No se pudo guardar"));
            }
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

   return (
    <div className="container-fluid p-4 bg-light min-vh-100">
        <div className="row g-4">

            {/* COLUMNA IZQUIERDA: EL CALENDARIO PRINCIPAL */}
            <div className="col-lg-8">
                <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                        initialView="timeGridWeek"
                        locales={[esLocale]}
                        locale="es" // 👈 CORRECCIÓN: Un solo locale
                        // 👈 CORRECCIÓN: Un solo atributo events leyendo del Store
                        events={store.appointments?.map(app => ({
                            id: app.id,
                            title: app.patient_name,
                            start: `${app.date}T${app.time}`,
                            backgroundColor: "#e8888c",
                            borderColor: "#e8888c",
                            extendedProps: { ...app }
                        })) || []}
                        selectable={esMedico}
                        selectMirror={true}
                        select={handleDateSelect}                            
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

            {/* COLUMNA DERECHA: LISTA DE CONSULTAS */}
            <div className="col-lg-4">
                <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white h-100">
                    <div className="p-3 border-bottom d-flex justify-content-between align-items-center" style={{ backgroundColor: "#566873" }}>
                        <h5 className="text-white mb-0 fw-bold small text-uppercase">
                            <i className="fas fa-clipboard-list me-2"></i>Consultas
                        </h5>
                        <div className="btn-group">
                            <button className="btn btn-sm text-white border-0" onClick={() => listRef.current.getApi().prev()}>
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <button className="btn btn-sm text-white border-0 mx-1" style={{ fontSize: '0.7rem' }} onClick={() => listRef.current.getApi().today()}>
                                HOY
                            </button>
                            <button className="btn btn-sm text-white border-0" onClick={() => listRef.current.getApi().next()}>
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
                            locales={[esLocale]}
                            locale="es"
                            events={store.appointments?.map(app => ({
                                title: app.patient_name,
                                start: `${app.date}T${app.time}`
                            })) || []}
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

        {/* MODAL DE NUEVA CITA */}
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
                                <label className="form-label small fw-bold text-secondary">BUSCAR PACIENTE</label>
                                <select className="form-select border-0 bg-light shadow-sm p-3" style={{ borderRadius: "12px" }}
                                    value={nuevaCita.pacienteId}
                                    onChange={(e) => setNuevaCita({ ...nuevaCita, pacienteId: e.target.value })}>
                                    <option value="">Seleccione un paciente...</option>
                                    {store.pacientes?.map(p => (
                                        <option key={p.id} value={p.id}>{p.nombre} {p.apellidos} ({p.dni})</option>
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
                                    value={nuevaCita.motivo}
                                    onChange={(e) => setNuevaCita({ ...nuevaCita, motivo: e.target.value })}></textarea>
                            </div>
                        </div>
                        <div className="modal-footer border-0 p-4 pt-0">
                            <button className="btn btn-light px-4" onClick={() => setShowModal(false)}>Cancelar</button>
                            <button className="btn text-white px-4" style={{backgroundColor: "#e8888c"}} onClick={handleGuardarCita}>Confirmar Cita</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
);
};