import React from 'react';
import Calendario from "./Calendario/Calendario";
import { useState, useEffect } from 'react';
// import DoctorScheduleBar from "./DoctorScheduleBar/DoctorScheduleBar"




function AreaPersonal() {
    const [pacientesHoy, setPacientesHoy] = useState([]);
    const profesional = { nombre: "Juan Pérez" };

    const cargarCita = async () => {
        try {
            const res = await fetch("https://special-train-g4vwpjx9pvqv3pvwv-3001.app.github.dev/api/appointments");
            const data = await res.json();
            const citasFormateadas = data
                .map(cita => {
                    if (!cita.date || !cita.time) {
                        console.log("Cita inválida:", cita);
                        return null;
                    }

                    const start = `${cita.date}T${cita.time}`;
                    const startDate = new Date(start);

                    if (isNaN(startDate)) {
                        console.warn("Fecha inválida:", start);
                        return null;
                    }

                    const endDate = new Date(startDate);
                    endDate.setHours(endDate.getHours() + 1);

                    return {
                        id: cita.id,
                        text: cita.patient_name || "Paciente",
                        start: start,
                        end: endDate.toISOString()
                    };
                })
                .filter(Boolean);

            setPacientesHoy(citasFormateadas);

        } catch (error) {
            console.log("Error cargando citas:", error);
        }
    };

    useEffect(() => {
        cargarCita();
    }, []);

    const createAppointment = async (data) => {
        try {
            const response = await fetch("https://special-train-g4vwpjx9pvqv3pvwv-3001.app.github.dev/api/appointment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) return null;
            await cargarCita();

        } catch (err) {
            console.log(err);
        }
    };
   const updateAppointment = async (appointment_id, updatedData) => {
    try {
        const response = await fetch(`https://special-train-g4vwpjx9pvqv3pvwv-3001.app.github.dev/api/appointment {appointment_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            await cargarCita();
        } else {
            console.log("Error al actualizar");
        }
    } catch (err) {
        console.log("Error de conexión:", err);
    }
};




    const contadorPacientes = {
        totalPacientes: pacientesHoy.length,
    };

    const eliminarPaciente = (id) => {
        // aqui debo poner mi llamado al delet del backend (ojooo)
        setPacientesHoy(prev => prev.filter(p => p.id !== id));
    };

    return (
        <div className="container-fluid p-4" style={{ minHeight: "100vh" }}>
            {/* <DoctorScheduleBar/> */}

            <div className="row mb-4 g-3">
                <div className="col-lg-12">
                    <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: "20px", borderLeft: "8px solid #93bbbf" }}>
                        <h2 className="text-secondary mb-1" style={{ fontSize: "2em" }}>
                            Bienvenido,{" "}
                            <span className="fw-bold" style={{ color: "#566873", fontSize: "1.7em" }}>
                                {profesional.nombre}!
                            </span>
                        </h2>

                        <div className="mt-3">
                            <span className="badge px-3 py-2" style={{ fontSize: "1.2em", backgroundColor: "#93bbbf", borderRadius: "10px" }}>
                                Profesional Activo
                            </span>

                            <span className="badge px-3 py-2 mx-4" style={{ fontSize: "1.2em", backgroundColor: "#e8888c", borderRadius: "10px" }}>
                                {contadorPacientes.totalPacientes === 0
                                    ? "No tienes pacientes hoy"
                                    : `Tienes ${contadorPacientes.totalPacientes} paciente${contadorPacientes.totalPacientes > 1 ? "s" : ""} hoy`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-12 mt-4">
                <div className="card border-0 shadow-sm p-3 h-100" style={{ borderRadius: "20px" }}>
                    <Calendario
                        events={pacientesHoy}
                        createAppointment={createAppointment}
                        onEliminarPaciente={eliminarPaciente}
                        updateAppointment={updateAppointment}
                    />

                    <button className="btn mt-3 fw-bold shadow-sm" style={{ backgroundColor: "#93bbbf", color: "white" }}>
                        + Nueva Consulta
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AreaPersonal;
