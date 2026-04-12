import React from 'react';
import Calendario from "./Calendario";

function Homeprivado() {
    const profesional = { nombre: "Juan Pérez" };
    // Estos datos los tenemos que cambiar por los de nuestra base de datos, solo spon de ejemplo
    const stats = {
        totalPacientes: 8,
        primerasVisitas: 3
    };

    const pacientesHoy = [
        { id: 1, hora: "09:00", nombre: "Juan Pérez", motivo: "Control rutinario" },
        { id: 2, hora: "10:30", nombre: "María García", motivo: "Primera Visita" }
    ];

    return (
        <div className="container-fluid p-4" style={{ minHeight: "100vh" }}>
        
            <div className="row mb-4 g-3">
                <div className="col-lg-8">
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
                
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm p-4 h-100 text-white" style={{ backgroundColor: "#566873", borderRadius: "20px" }}>
                        <div className="d-flex justify-content-around text-center">
                            <div>
                                <h3 className="display-6 fw-bold mb-0">{stats.totalPacientes}</h3>
                                <small className="opacity-75">Pacientes Hoy</small>
                            </div>
                            <div className="vr"></div>
                            <div>
                                <h3 className="display-6 fw-bold mb-0">{stats.primerasVisitas}</h3>
                                <small className="opacity-75">1ª Visitas</small>
                            </div>
                        </div>
                        <button className="btn mt-3 fw-bold shadow-sm" style={{ backgroundColor: "#93bbbf", color: "white" }}>
                            + Nueva Consulta
                        </button>
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
                                        <th className="text-end">Acciones</th>
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
                        <Calendario />
                    </div>
                </div>
        </div>
    );
}

export default Homeprivado;
