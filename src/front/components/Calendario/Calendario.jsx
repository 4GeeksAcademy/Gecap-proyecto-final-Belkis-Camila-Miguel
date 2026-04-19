import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale/es";
import CitasPorDia from './Citaspordia';
import "../Calendario/Calendario.css";


function Calendario({ onAgregarCita, onEliminarCita, pacienteHoy, onActualizarCita}) {
    // Esto hace que al seleccionar una fecha en el calendario pequenio se re-renderice el daypicker cpn la fecha seleccionada 

    const [startDate, setStartDate] = useState(new Date());

    const manejarSeleccionDia = (date) => {
        setStartDate(date);
    };

    return (
        <div className="mt-2">
            <div className="d-flex gap-3 align-items-start">
                <div className="card border-0 flex-grow-1">
                    <div className='d-flex justify-content-between mx-3'>
                        <strong>
                            {startDate.toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </strong>
                        <h5 className="badge rounded-3 text-light px-3 py-2 fw-bold " style={{ backgroundColor: "#93bbbf", fontSize: "1rem", }}>Hoy</h5>

                    </div>

                    <CitasPorDia
                        fechaSeleccionada={startDate}
                        onAgregarCita={onAgregarCita}
                        onEliminarCita={onEliminarCita}
                        pacientesHoy={pacienteHoy}
                        onActualizarCita={onActualizarCita}
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
                    <button className="btn fw-bold shadow-sm w-100" style={{ backgroundColor: "#93bbbf", color: "white", letterSpacing: "0.7px" }}>
                        + Nueva cita
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Calendario;