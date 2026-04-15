import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale/es";
import Scheduler from './Citaspordia';
import "../Calendario/Calendario.css";

function Calendario({ onAgregarPaciente, onEliminarPaciente }) {

    const [startDate, setStartDate] = useState(new Date());

    const manejarSeleccionDia = (date) => {
        setStartDate(date);
    };

    const agregarCita = () => {

        const nuevaCita = {
            id: Date.now(),
            hora: "23:00",
            nombre: "Carlos López",
            motivo: "Control"
        };

        onAgregarPaciente(nuevaCita);
    };

    return (
        <div className="mt-4">
            <div className="d-flex gap-3 align-items-start">

                <div className="card border-0 shadow-sm flex-grow-1">
                    <div className="card-body">
                        <h6 className="card-title text-muted">
                            <strong>
                                {startDate.toLocaleDateString('es-ES', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </strong>
                        </h6>

                        <hr />

                        <div className="mt-2">
                            <p className="text-secondary">CITAS</p>

                            <Scheduler
                                fechaSeleccionada={startDate}
                                onAgregarPaciente={onAgregarPaciente}
                                onEliminarPaciente={onEliminarPaciente}
                            />

                            <button
                                className="btn btn-sm mt-3 text-white"
                                style={{ backgroundColor: "#93bbbf" }}
                                onClick={agregarCita}
                            >
                                Agregar cita de prueba
                            </button>

                            <textarea
                                className="form-control border-0 bg-light"
                                rows="2"
                                placeholder="Escribir nueva observación..."
                            ></textarea>

                        </div>
                    </div>
                </div>

                <div className='contenedor-calendario shadow-sm bg-white p-2 rounded'>
                    <DatePicker
                        selected={startDate}
                        onChange={manejarSeleccionDia}
                        inline
                        locale={es}
                        outsideClickIgnoreClass="react-datepicker__day--outside-month"
                    />
                </div>
            </div>
        </div>
    );
}

export default Calendario;