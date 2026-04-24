import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale/es";
import CitasPorDia from './Citaspordia';
import "../Calendario/Calendario.css";

function Calendario({ onAgregarCita, onEliminarCita, pacienteHoy, onActualizarCita }) {
    const [startDate, setStartDate] = useState(new Date());

    const [abrirModalBoton, setAbrirModalBoton] = useState(false);

    useEffect(() => {
        if (pacienteHoy.length > 0) {
            const primeraFecha = pacienteHoy[0].start || pacienteHoy[0].date;
            setStartDate(new Date(primeraFecha));
        }
    }, [pacienteHoy]);
    
    const [mensajesWeb, setMensajesWeb] = useState([]);
  
    const manejarSeleccionDia = (date) => {
        setStartDate(date);
    };
    
    const cargarMensajes = async () => {
         const token = localStorage.getItem("token"); 

    if (!token || token === "null") {
        console.warn("Token no encontrado o inválido");
        return;
    }

    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/messages`, {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const data = await response.json();
            setMensajesWeb(data);
        } else if (response.status === 422) {
            console.error("Error 422: El servidor rechaza el formato del token");
        }
    } catch (error) {
        console.error("Error en la petición:", error);
    }
};

    return (
        <div className="mt-2">
            <div className="d-flex gap-3 align-items-start">
                <div className="card border-0 flex-grow-1">
                    <div className='d-flex justify-content-between mx-3'>
                        <strong>
                            {startDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </strong>
                        <div className="dropdown">
                            <button className="btn dropdown-toggle text-light fw-bold" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                             style={{backgroundColor:"#93bbbf"}}>
                               Ver por: {seleccionarVista === "Day" ? "Día" : "Semana"}
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <button className="dropdown-item" onClick={() => setSeleccionarVista("Day")} >Dia</button>
                                <button className="dropdown-item" onClick={()=>setSeleccionarVista("Week")}>Semana</button>
                            </div>
                        </div>

                    </div>

                    <CitasPorDia
                        fechaSeleccionada={startDate}
                        onAgregarCita={onAgregarCita}
                        onEliminarCita={onEliminarCita}
                        pacientesHoy={pacienteHoy}
                        onActualizarCita={onActualizarCita}
                        abrirModalBoton={abrirModalBoton}
                        setAbrirModalBoton={setAbrirModalBoton}
                        seleccionarVista={seleccionarVista}
                    />
                </div>

                <div className='contenedor-calendario shadow-sm bg-white p-2 rounded'>
                    <DatePicker
                        selected={startDate}
                        onChange={manejarSeleccionDia}
                        inline
                        locale={es}
                        outsideClickIgnoreClass="react-datepicker__day--outside-month"
                    />
                    <button
                        className="btn fw-bold shadow-sm w-100"
                        style={{ backgroundColor: "#93bbbf", color: "white", letterSpacing: "0.7px" }}
                        onClick={() => setAbrirModalBoton(true)}
                    >
                        + Nueva cita
                    </button>

                    {/* BOTÓN SOLICITADO */}
                    <button 
                        className="btn fw-bold shadow-sm w-100 position-relative" 
                        style={{ backgroundColor: "#566873", color: "white", letterSpacing: "0.7px" }}
                        data-bs-toggle="modal" 
                        data-bs-target="#modalMensajesWeb"
                        onClick={cargarMensajes}
                    >
                        <i className="fas fa-envelope-open-text me-2"></i>
                        Mensajes Web
                        {mensajesWeb.length > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {mensajesWeb.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* MODAL DE MENSAJES WEB */}
            <div className="modal fade" id="modalMensajesWeb" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "20px" }}>
                        <div className="modal-header border-0 pt-4 px-4">
                            <h5 className="fw-bold" style={{ color: "#566873" }}>Solicitudes desde la Web</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body p-4">
                            {mensajesWeb.length === 0 ? (
                                <p className="text-center text-muted">No hay mensajes nuevos.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Paciente</th>
                                                <th>DNI</th>
                                                <th>Motivo</th>
                                                <th>Teléfono</th>
                                                <th>Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mensajesWeb.map((msg) => (
                                                <tr key={msg.id}>
                                                    <td className="fw-bold">{msg.full_name}</td>
                                                    <td>{msg.dni}</td>
                                                    <td><small>{msg.reason}</small></td>
                                                    <td>{msg.phone}</td>
                                                    <td>
                                                        <button className="btn btn-outline-danger btn-sm border-0" onClick={() => eliminarMensaje(msg.id)}>
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Calendario;
