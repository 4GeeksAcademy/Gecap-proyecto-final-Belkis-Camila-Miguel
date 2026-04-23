import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale/es";
import CitasPorDia from './Citaspordia';
import "../Calendario/Calendario.css";



function Calendario({ onAgregarCita, onEliminarCita, pacienteHoy, onActualizarCita}) {

    const [startDate, setStartDate] = useState(new Date());
    const [seleccionarVista, setSeleccionarVista]= useState("Day")

    
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
                    <button className="btn fw-bold shadow-sm w-100 text-light" style={{ backgroundColor: "#93bbbf", letterSpacing: "0.7px" }}>
                        + Nueva cita
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Calendario;
