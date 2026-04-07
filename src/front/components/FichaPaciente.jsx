import React from "react";

export const FichaPaciente = () => {
    // Datos de ejemplo (Luego los traerás de tu base de datos/API)
    const paciente = {
        nombre: "Juan Pérez García",
        dni: "12345678X",
        fechaNacimiento: "15/05/1985",
        telefono: "600 000 000",
        email: "juan.perez@email.com",
        direccion: "Calle Mayor 15, Madrid",
        grupoSanguineo: "A+",
        alergias: "Polen, Penicilina",
        antecedentes: "Hipertensión controlada",
        ultimaConsulta: "12/03/2024"
    };

    return (
        <div className="container-fluid">
            {/* Cabecera con Nombre y Estado */}
            <div className="d-flex justify-content-between align-items-center mb-4 p-3 rounded shadow-sm bg-white border-start border-5" style={{ borderColor: "#e8888c" }}>
                <div>
                    <h2 className="mb-0 fw-bold" style={{ color: "#566873" }}>{paciente.nombre}</h2>
                    <span className="badge mt-2" style={{ backgroundColor: "#93bbbf" }}>Paciente Activo</span>
                </div>
                <div className="text-end">
                    <p className="mb-0 text-muted small">Última visita</p>
                    <p className="fw-bold" style={{ color: "#566873" }}>{paciente.ultimaConsulta}</p>
                </div>
            </div>

            <div className="row">
                {/* Columna Izquierda: Datos Personales */}
                <div className="col-lg-4 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header text-white" style={{ backgroundColor: "#566873" }}>
                            <i className="fas fa-id-card me-2"></i> Datos Personales
                        </div>
                        <div className="card-body bg-white">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0">
                                    <span className="text-muted">DNI:</span>
                                    <span className="fw-bold">{paciente.dni}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0">
                                    <span className="text-muted">Nacimiento:</span>
                                    <span>{paciente.fechaNacimiento}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0">
                                    <span className="text-muted">Teléfono:</span>
                                    <span style={{ color: "#e8888c" }}>{paciente.telefono}</span>
                                </li>
                                <li className="list-group-item border-0 px-0">
                                    <span className="text-muted d-block">Dirección:</span>
                                    <span className="small">{paciente.direccion}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Información Médica Crítica */}
                <div className="col-lg-8 mb-4">
                    <div className="row h-100">
                        {/* Alergias y Alertas */}
                        <div className="col-md-6 mb-4">
                            <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: "#ebf2f1" }}>
                                <div className="card-body">
                                    <h6 className="fw-bold" style={{ color: "#e8888c" }}>
                                        <i className="fas fa-exclamation-triangle me-2"></i> Alergias Conocidas
                                    </h6>
                                    <p className="mb-0">{paciente.alergias}</p>
                                </div>
                            </div>
                        </div>

                        {/* Grupo Sanguíneo */}
                        <div className="col-md-6 mb-4">
                            <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: "#b4d2d9" }}>
                                <div className="card-body text-center d-flex flex-column justify-content-center">
                                    <h6 className="fw-bold mb-1" style={{ color: "#566873" }}>Grupo Sanguíneo</h6>
                                    <h2 className="mb-0 fw-black" style={{ color: "#566873" }}>{paciente.grupoSanguineo}</h2>
                                </div>
                            </div>
                        </div>

                        {/* Historial Breve */}
                        <div className="col-12 mt-2">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header text-white" style={{ backgroundColor: "#93bbbf" }}>
                                    <i className="fas fa-history me-2"></i> Observaciones Médicas
                                </div>
                                <div className="card-body bg-white">
                                    <p className="card-text">{paciente.antecedentes}</p>
                                    <hr />
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-sm text-white" style={{ backgroundColor: "#e8888c" }}>Nueva Consulta</button>
                                        <button className="btn btn-sm btn-outline-secondary">Editar Ficha</button>
                                        <button className="btn btn-sm btn-outline-secondary">Ver Analíticas</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};