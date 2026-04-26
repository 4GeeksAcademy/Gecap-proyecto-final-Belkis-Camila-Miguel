import React from 'react';
import Calendario from "./Calendario/Calendario";
import { useState, useEffect } from 'react';
import DoctorScheduleBar from "./DoctorScheduleBar/DoctorScheduleBar";

function AreaPersonal() {
    const [pacientesHoy, setPacientesHoy] = useState([]);
    const [nombreUsuario, setNombreUsuario]= useState("Usuario")
    
    useEffect(() => {
        const datosGuardados= localStorage.getItem("user");
        if(datosGuardados){
        const user= JSON.parse(datosGuardados);
        setNombreUsuario (user.user_name);
    }
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/appointments`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then((response) => {
                if (!response.ok) throw new Error("Error en la carga de citas");
                return response.json();
            })
            .then((data) => {
                console.log("Citas cargadas:", data);
                setPacientesHoy(data);
            })
            .catch((error) => console.log("Error:", error));
    }, []);


    const addAppointmentDataBase = async (nuevoPaciente) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/appointment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    patient_id: nuevoPaciente.id,
                    nombre: nuevoPaciente.nombre,
                    date: nuevoPaciente.date,
                    start: nuevoPaciente.start,
                    end: nuevoPaciente.end,
                    status: nuevoPaciente.status,
                    reason: nuevoPaciente.reason || "Consulta" 
                })
            });

            if (response.ok) {
                const data = await response.json();
                setPacientesHoy(prev => [...prev, data.appointment]);
            } else {
                console.log("Error al guardar en el servidor");
            }
        } catch (error) {
            console.log("Error de red:", error);
        }
    };

    const eliminarPaciente = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/appointment/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                }
            });

            if (response.ok) {
                setPacientesHoy(prev => prev.filter(p => p.id !== id));
            } else {
                alert("No se pudo eliminar la cita en el servidor");
            }
        } catch (error) {
            console.log("Error al eliminar:", error);
        }
    };

    const actualizarCita = async (id, datosActualizados) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/appointment/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(datosActualizados)
            });
            console.log (datosActualizados)

            if (response.ok) {
                const citaEditada = await response.json();
                setPacientesHoy(prev => prev.map(cita => cita.id === id ? citaEditada.datos : cita));
            }
        } catch (error) {
            console.log("Error al actualizar:", error);
        }
    };

    const citasNormalizadas = pacientesHoy.map(cita => ({
        id: cita.id,
        nombre: cita.nombre || cita.patient_name || "Sin nombre",
        motivo: cita.motivo || cita.reason || "",
        telefono: cita.telefono || "",
        start: cita.start ? new Date(cita.start) : null,
        end: cita.end ? new Date(cita.end) : null,
        hora: cita.hora || "",
    }));

    const ahora = new Date();

    const proximasCitas = citasNormalizadas
        .filter(cita => cita.start && cita.start > ahora)
        .sort((a, b) => a.start - b.start);

    const proximaCita = proximasCitas[0] || null;

    return (


        <div className="container-fluid" style={{ minHeight: "100vh" }}>
            <div className="card border-0 shadow-sm" style={{ borderRadius: "15px", overflow: "hidden" }}>
                <div style={{ height: "6px", backgroundColor: "#93bbbf" }}></div>

                <div className="card-body py-2 px-1">
                    <div className="d-flex justify-content-between align-items-center mb-2 mx-3">
                        <div>
                            <span
                                className="badge rounded-pill"
                                style={{
                                    fontSize: "0.9rem",
                                    backgroundColor: "rgba(147, 187, 191, 0.2)",
                                    color: "#566873",
                                    border: "1px solid #93bbbf"
                                }}
                            >
                                <i className="fas fa-circle me-1" style={{ fontSize: "0.9rem" }}></i> Profesional Activo
                            </span>
                        </div>

                        <div className="text-end">
                            <p className="text-muted mb-0" style={{ fontSize: "1.3rem" }}>
                                Bienvenido, <span className="fw-bold" style={{ color: "#4a5568" }}>{nombreUsuario}!</span>
                            </p>
                        </div>
                    </div>

                    <div className="px-1">
                        <DoctorScheduleBar
                            appointments={citasNormalizadas}
                            proximaCita={proximaCita}
                        />
                    </div>
                </div>
            </div>

            <div className="col-md-12 mt-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "20px", overflow: "hidden" }}>
                    <div style={{ height: "6px", width: "100%", backgroundColor: "#93bbbf" }}></div>
                    <div className="card-body p-3">
                        <Calendario
                            onAgregarCita={addAppointmentDataBase}
                            pacienteHoy={pacientesHoy}
                            onEliminarCita={(id) => eliminarPaciente(id)}
                            onActualizarCita={(id, cita) => actualizarCita(id, cita)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AreaPersonal;
