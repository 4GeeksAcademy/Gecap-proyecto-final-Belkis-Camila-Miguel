import React from 'react';
import Calendario from "./Calendario";
import { useState } from 'react';
import DoctorScheduleBar from "../DoctorScheduleBar/DoctorScheduleBar";

function Homeprivado() {
    // Estos datos los tenemos que cambiar por los de nuestra base de datos, solo spon de ejemplo
    const [pacientesHoy, setPacientesHoy] = useState([]);
    const profesional = { nombre: "Juan Pérez" };
    const stats = {
        totalPacientes: pacientesHoy.length,
    };
    const eliminarPaciente = (id) => {
        setPacientesHoy(prev => prev.filter(p => p.id !== id));
    };
    return (
        <div className="container-fluid p-4" style={{ minHeight: "100vh" }}>

            <div className="mb-4">
                <DoctorScheduleBar />
            </div>

            <div className="row mb-4 g-3">
                <div className="col-lg-9">
                    <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: "20px", borderLeft: "8px solid #93bbbf" }}>
                        <h2 className="text-secondary mb-1" style={{ fontSize: "1.1em" }}>Bienvenido,</h2>
                        <h1 className="fw-bold" style={{ color: "#566873", fontSize: "2em" }}>{profesional.nombre}</h1>
                        <div className="mt-3">
                            <span className="badge px-3 py-2" style={{ backgroundColor: "#93bbbf", borderRadius: "10px" }}>
                                <i className="fas fa-check-circle me-1"></i> Profesional Activo
                            </span>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3">
                    <div className="card border-0 shadow-sm p-4 h-100 text-white" style={{ backgroundColor: "#566873", borderRadius: "20px" }}>
                        <div className="d-flex justify-content-around text-center">
                            <div>
                                <h3 className="mt-4">
                                    {stats.totalPacientes === 0
                                        ? "No tienes pacientes hoy"
                                        : `Tienes ${stats.totalPacientes} paciente${stats.totalPacientes > 1 ? "s" : ""} hoy`}
                                </h3>
                                 <button className="btn mt-3 fw-bold shadow-sm" style={{ backgroundColor: "#93bbbf", color: "white" }}>
                            + Nueva Consulta
                        </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-md-12">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "20px" }}>
                        <div className="card-header bg-transparent border-0 pt-4 px-4">
                            <h5 className="fw-bold" style={{ color: "#566873" }}>Agenda del Día</h5>
                        </div>
                        <div className="table-responsive p-3">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr style={{ color: "#566873" }}>
                                        <th>Hora</th>
                                        <th>Paciente</th>
                                        <th className="text-end"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pacientesHoy.map((p) => (
                                        <tr key={p.id}>
                                            <td className="fw-bold text-secondary">{p.hora}</td>
                                            <td>
                                                <div className="fw-bold">{p.nombre}</div>
                                                <small className="text-muted">{p.motivo}</small>
                                            </td>
                                            <td className="text-end">
                                                <button className="btn btn-sm me-2" style={{ color: "#566873", border: "1px solid #566873" }}>
                                                    Ver Ficha
                                                </button>
                                                <button className="btn btn-sm text-white" style={{ backgroundColor: "#e8888c" }}>
                                                    Atender
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                </div>
            </div>
        </div>
    );
}

export default Homeprivado;
