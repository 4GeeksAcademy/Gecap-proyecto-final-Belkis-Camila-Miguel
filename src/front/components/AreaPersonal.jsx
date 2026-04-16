import React from 'react';
import Calendario from "./Calendario/Calendario";
import { useState, useEffect } from 'react';
import DoctorScheduleBar from "./DoctorScheduleBar/DoctorScheduleBar";

function AreaPersonal() {
    const [pacientesHoy, setPacientesHoy] = useState([]);
    const profesional = { nombre: "Juan Pérez" };

    useEffect(() => {
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
            .catch((error) => console.error("Error:", error));
    }, []);

    const stats = {
        totalPacientes: pacientesHoy.length,
    };
    const eliminarPaciente = (id) => {
        setPacientesHoy(prev => prev.filter(p => p.id !== id));
    };
    return (
        <div className="container-fluid p-4" style={{ minHeight: "100vh" }}>

            <div className="mb-4">
                <DoctorScheduleBar appointments={pacientesHoy} />
            </div>

            <div className="row mb-4 g-3">
                <div className="col-lg-12">
                    <div className="card border-0 shadow-sm p-4 h-100 " style={{ borderRadius: "20px", borderLeft: "8px solid #93bbbf" }}>
                        <h2 className="text-secondary mb-1" style={{ fontSize: "2em" }}>Bienvenido,{" "}
                            <span className="fw-bold" style={{ color: "#566873", fontSize: "1.7em" }}>{profesional.nombre}{"!"}</span>
                        </h2>
                        <div className="mt-3">
                            <span className="badge px-3 py-2" style={{ fontSize: "1.2em", backgroundColor: "#93bbbf", borderRadius: "10px" }}>
                                <i className="fas fa-check-circle me-1"></i> Profesional Activo
                            </span>
                            <span className="badge px-3 py-2 mx-4" style={{ fontSize: "1.2em", backgroundColor: "#e8888c", borderRadius: "10px" }}>
                                <i className="fas fa-check-circle me-1"></i> {stats.totalPacientes === 0
                                    ? "No tienes pacientes hoy"
                                    : `Tienes ${stats.totalPacientes} paciente${stats.totalPacientes > 1 ? "s" : ""} hoy`}
                            </span>
                        </div>

                    </div>
                </div>
            </div>

            <div className="col-md-12 mt-4">
                <div className="card border-0 shadow-sm p-3 h-100" style={{ borderRadius: "20px" }}>
                    <Calendario onAgregarPaciente={(nuevoPaciente) =>
                        setPacientesHoy(prev => [...prev, nuevoPaciente])
                    }
                        onEliminarPaciente={(id) =>
                            setPacientesHoy(prev => prev.filter(p => p.id !== id))} />
                    <button className="btn mt-3 fw-bold shadow-sm" style={{ backgroundColor: "#93bbbf", color: "white" }}>
                        + Nueva Consulta
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AreaPersonal;
