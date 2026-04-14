import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export const AgendaMedica = () => {
    // Usamos tu hook personalizado en lugar de useContext(Context)
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [slotSeleccionado, setSlotSeleccionado] = useState(null);


    // Ahora store ya no será null porque el hook gestiona el acceso
    const user = store?.user || { nombre: "Invitado", role: "paciente" };
    const esMedico = user.role === "medico";

    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);

    // 2. Simulación de datos (Esto vendrá de tu base de datos propia)
    const [citas, setCitas] = useState([
        { id: 1, hora: "09:00", disponible: true },
        { id: 2, hora: "09:15", disponible: false, paciente: "Juan Pérez", motivo: "Limpieza" },
        { id: 3, hora: "09:30", disponible: true },
        { id: 4, hora: "09:45", disponible: false, paciente: "Ana García", motivo: "Extracción" },
        { id: 5, hora: "10:00", disponible: true },
        { id: 6, hora: "10:15", disponible: false, paciente: "Juan Pérez", motivo: "Limpieza" },
        { id: 7, hora: "10:30", disponible: true },
        { id: 8, hora: "10:45", disponible: false, paciente: "Ana García", motivo: "Extracción" },
        { id: 9, hora: "11:00", disponible: true },
        { id: 10, hora: "11:15", disponible: false, paciente: "Juan Pérez", motivo: "Limpieza" },
        { id: 11, hora: "11:30", disponible: true },
        { id: 12, hora: "11:45", disponible: false, paciente: "Ana García", motivo: "Extracción" },
        { id: 13, hora: "12:00", disponible: true },
        { id: 14, hora: "12:15", disponible: false, paciente: "Juan Pérez", motivo: "Limpieza" },
        { id: 15, hora: "12:30", disponible: true },
        { id: 16, hora: "12:45", disponible: false, paciente: "Ana García", motivo: "Extracción" },
        { id: 17, hora: "13:00", disponible: false, paciente: "Ana García", motivo: "Extracción" },
    ]);

    return (
        <div className="container-fluid py-5" style={{ backgroundColor: "#ebf2f1", minHeight: "100vh" }}>
            <div className="container" style={{ maxWidth: "1050px" }}>

                {/* BOTÓN VOLVER */}
                <button
                    onClick={() => navigate("/dashboard")}
                    className="btn mb-4 d-flex align-items-center shadow-sm"
                    style={{ backgroundColor: "#93bbbf", color: "#ffffff", borderRadius: "8px" }}
                >
                    <i className="fas fa-arrow-left me-2"></i> Volver al Dashboard
                </button>

                {/* CABECERA DINÁMICA */}
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-secondary">
                        {esMedico ? "Gestión Médica" : `Hola ${user.nombre}, solicita tu cita`}
                    </h2>
                    <div style={{ width: "60px", height: "4px", backgroundColor: "#e8888c", margin: "10px auto", borderRadius: "2px" }}></div>
                    <p style={{ color: "#566873" }}>
                        {esMedico ? "Gestiona los pacientes de hoy" : "Selecciona un hueco disponible para tu consulta."}
                    </p>
                </div>

                <div className="row g-4">
                    {/* COLUMNA IZQUIERDA: CALENDARIO */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-4 p-3 bg-white border-top border-4" style={{ borderColor: "#93bbbf" }}>
                            <h6 className="fw-bold mb-3 text-uppercase small" style={{ color: "#566873", letterSpacing: "1px" }}>
                                <i className="fas fa-calendar-alt me-2"></i>Agenda Mensual
                            </h6>

                            <div className="custom-calendar-wrapper">
                                <Calendar
                                    onChange={(date) => {
                                        // Obtenemos año, mes y día por separado según la hora LOCAL del navegador
                                        const year = date.getFullYear();
                                        const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes empieza en 0
                                        const day = String(date.getDate()).padStart(2, '0');

                                        // Unimos en formato YYYY-MM-DD sin pasar por ISO
                                        const fechaLocal = `${year}-${month}-${day}`;

                                        setFechaSeleccionada(fechaLocal);
                                    }}
                                    value={new Date(fechaSeleccionada)}
                                    locale="es-ES"
                                    view="month"
                                    prev2Label={null}
                                    next2Label={null}
                                />
                            </div>

                            <style>{`
                                .react-calendar { width: 100% !important; border: none !important; background: transparent !important; }
                                .react-calendar__navigation { margin-bottom: 1rem; }
                                .react-calendar__navigation button { background: none; border: none; font-weight: bold; color: #566873; }
                                .react-calendar__month-view__weekdays { text-transform: uppercase; font-size: 0.65rem; color: #93bbbf; font-weight: bold; }
                                .react-calendar__month-view__weekdays__weekday abbr { text-decoration: none; }
                                .react-calendar__tile { padding: 12px 5px !important; border-radius: 10px; transition: 0.2s; font-size: 0.85rem; }
                                .react-calendar__tile:hover { background-color: #f8fafb !important; color: #e8888c; }
                                .react-calendar__tile--now { background-color: #ebf2f1 !important; color: #5e888c; border: 1px solid #93bbbf !important; }
                                .react-calendar__tile--active { background: #e8888c !important; color: white !important; box-shadow: 0 4px 12px rgba(232, 136, 140, 0.3); }
                            `}</style>

                            <div className="mt-4 p-3 rounded-4" style={{ backgroundColor: "#f8fafb" }}>
                                <div className="d-flex align-items-center mb-2">
                                    <div className="rounded-circle me-2" style={{ width: "10px", height: "10px", backgroundColor: "#28a745" }}></div>
                                    <span className="small fw-bold text-secondary">Días Disponibles</span>
                                </div>
                                <p className="small text-muted mb-0 italic" style={{ fontSize: '0.75rem' }}>
                                    <i className="fas fa-info-circle me-1"></i> Selecciona un día para ver las horas.
                                </p>
                            </div>
                        </div>

                        {esMedico && (
                            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mt-4 text-center">
                                <h2 className="fw-bold text-info mb-0">12</h2>
                                <p className="small text-muted mb-0">Citas para hoy</p>
                            </div>
                        )}
                    </div>

                    {/* COLUMNA DERECHA: LISTADO DE HUECOS */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white min-vh-50">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-bold mb-0 text-secondary text-capitalize">
                                    {new Date(fechaSeleccionada).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </h5>
                                <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: "#ebf2f1", color: "#566873" }}>
                                    {citas.filter(s => s.disponible).length} huecos libres
                                </span>
                            </div>

                            <div className="d-grid gap-3">
                                {citas.map((cita) => (
                                    <div key={cita.id}
                                        className={`d-flex align-items-center justify-content-between p-3 rounded-4 border-start border-5 shadow-sm 
                                        ${cita.disponible ? 'border-success bg-light' : 'border-danger bg-danger bg-opacity-10'}`}>

                                        <div className="d-flex align-items-center">
                                            <div className="fw-bold h5 mb-0 me-4 text-dark" style={{ minWidth: "70px" }}>{cita.hora}</div>
                                            <div>
                                                {cita.disponible ? (
                                                    <span className="text-success small fw-bold"><i className="fas fa-check-circle me-1"></i> Libre</span>
                                                ) : (
                                                    <div>
                                                        <span className="text-danger small fw-bold"><i className="fas fa-user-lock me-1"></i> Ocupado</span>
                                                        {esMedico && (
                                                            <div className="small text-dark fw-bold mt-1">
                                                                {cita.paciente} - <span className="text-muted fw-normal">{cita.motivo}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {cita.disponible ? (
                                            <button
                                                className="btn btn-sm px-4 text-white fw-bold shadow-sm"
                                                style={{ backgroundColor: "#e8888c", borderRadius: "10px" }}
                                                onClick={() => {
                                                    setSlotSeleccionado(cita);
                                                    setShowModal(true);
                                                }}
                                            >
                                                {esMedico ? "Bloquear" : "Pedir Cita"}
                                            </button>
                                        ) : (
                                            esMedico && (
                                                <button className="btn btn-sm btn-outline-secondary border-0">
                                                    <i className="fas fa-ellipsis-v"></i>
                                                </button>
                                            )
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div> {/* Fin col-lg-8 */}
                </div> {/* Fin Row */}
            </div> {/* Fin Container */}

            {/* MODAL DE CONFIRMACIÓN (Dentro de la última etiqueta div del componente) */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 2000 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow">
                            <div className="modal-header border-0 p-4 pb-0">
                                <h5 className="fw-bold mb-0" style={{ color: "#566873" }}>Confirmar Cita</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <p className="text-muted">Estás reservando para el día <strong>{new Date(fechaSeleccionada).toLocaleDateString()}</strong> a las <strong>{slotSeleccionado?.hora}</strong>.</p>
                                <label className="small fw-bold text-secondary mb-2">Motivo de la consulta</label>
                                <select className="form-select border-0 bg-light mb-3">
                                    <option>Revisión General</option>
                                    <option>Primera Consulta</option>
                                    <option>Urgencia</option>
                                    <option>Tratamiento Específico</option>
                                </select>
                                <textarea className="form-control border-0 bg-light" placeholder="Añade algún detalle..." rows="3"></textarea>
                            </div>
                            <div className="modal-footer border-0 p-4 pt-0">
                                <button className="btn btn-light px-4" style={{ borderRadius: "10px" }} onClick={() => setShowModal(false)}>Cancelar</button>
                                <button className="btn px-4 text-white" style={{ backgroundColor: "#e8888c", borderRadius: "10px" }} onClick={() => setShowModal(false)}>Confirmar Reserva</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};