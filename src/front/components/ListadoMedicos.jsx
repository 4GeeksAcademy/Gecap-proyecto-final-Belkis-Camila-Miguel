import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

export const ListadoMedicos = () => {
    const { store } = useGlobalReducer();
    const navigate = useNavigate();
    const [profesionales, setProfesionales] = useState([]);

    const obtenerEquipo = async () => {
        try {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/medicos`);
            if (resp.ok) {
                const data = await resp.json();
                console.log("Médicos recibidos:", data);
                setProfesionales(data);
            }
        } catch (error) {
            console.error("Error cargando equipo médico:", error);
        }
    };

    useEffect(() => {
        obtenerEquipo();
        const intervalo = setInterval(obtenerEquipo, 60000);
        return () => clearInterval(intervalo);
    }, []);

    return (
        <div className="container mt-5 px-4">
            <div className="d-flex align-items-center mb-5 pb-3 border-bottom">
                <div className="p-3 rounded-circle me-3" style={{ backgroundColor: "#5e888c", color: "white" }}>
                    <i className="fas fa-user-md fa-2x"></i>
                </div>
                <div>
                    <h2 className="mb-0 fw-bold" style={{ color: "#5e888c" }}>Directorio Médico Profesional</h2>
                    <p className="text-muted mb-0">Gestión y contacto del equipo facultativo de GECAP</p>
                </div>
            </div>

            <div className="row">
                {profesionales.map(pro => {
                    const esYo = String(pro.id) === String(store.user?.id);

                    return (
                        <div key={pro.id} className="col-12 col-md-6 col-lg-4 mb-4">                           
                            <div className="card h-100 border-0 shadow-sm"
                                style={{
                                    borderRadius: "20px",
                                    transition: "0.3s",
                                    borderTop: esYo ? "6px solid #5e888c" : "1px solid #f0f0f0"
                                }}>
                                
                                <div className="card-body p-4 d-flex flex-column">

                                    <div className="d-flex justify-content-between align-items-start mb-3" style={{ minHeight: "50px" }}>
                                        <div className="d-flex align-items-center">
                                            <div style={{
                                                width: "12px", height: "12px", borderRadius: "50%",
                                                backgroundColor: pro.is_online ? "#93c47d" : "#9ca3af",
                                                boxShadow: pro.is_online ? "0 0 10px #93c47d" : "none",
                                                marginRight: "12px",
                                                flexShrink: 0
                                            }}></div>
                                            <h5 className="card-title mb-0 fw-bold text-dark text-truncate" style={{ maxWidth: "180px" }}>
                                                {pro.user_name}
                                            </h5>
                                        </div>
                                        {esYo && <span className="badge rounded-pill bg-info text-dark" style={{ fontSize: "0.6rem" }}>TÚ</span>}
                                    </div>
                                    
                                    <div className="flex-grow-1">
                                        <div className="d-flex align-items-center mb-3 p-2 rounded-3 bg-light" style={{ minHeight: "55px" }}>
                                            <i className="fas fa-stethoscope me-3 text-secondary" style={{ width: "20px" }}></i>
                                            <div>
                                                <small className="d-block text-muted text-uppercase fw-bold" style={{ fontSize: "0.6rem" }}>Especialidad</small>
                                                <span className="fw-semibold small">{pro.especialidad || "Medicina General"}</span>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center mb-4 p-2 rounded-3 bg-light" style={{ minHeight: "55px" }}>
                                            <i className="fas fa-id-card me-3 text-secondary" style={{ width: "20px" }}></i>
                                            <div>
                                                <small className="d-block text-muted text-uppercase fw-bold" style={{ fontSize: "0.6rem" }}>Nº Colegiado</small>
                                                <span className="fw-semibold small">{pro.num_colegiado || "No registrado"}</span>
                                            </div>
                                        </div>
                                    </div>
                                  
                                    <div className="mt-auto pt-3 border-top">
                                        {esYo ? (
                                            <button
                                                onClick={() => navigate("/perfil")}
                                                className="btn btn-outline-secondary w-100 py-2 fw-bold"
                                                style={{ borderRadius: "10px", border: "2px solid #b4d2d9", color: "#566873", fontSize: "0.85rem" }}
                                            >
                                                <i className="fas fa-user-edit me-2"></i> Editar mi perfil
                                            </button>
                                        ) : (
                                            <a
                                                href={`mailto:${pro.email}?subject=Consulta GECAP`}
                                                className="btn w-100 py-2 fw-bold shadow-sm"
                                                style={{ backgroundColor: "#5e888c", color: "white", borderRadius: "10px", fontSize: "0.85rem", textDecoration: "none", display: "block", textAlign: "center" }}
                                            >
                                                <i className="fas fa-paper-plane me-2"></i> Contactar ahora
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};