import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export const CitasWeb = () => {
    const { dni } = useParams();
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/messages/${dni}`);
                if (response.ok) {
                    const data = await response.json();
                    setSolicitudes(data);
                } else if (response.status === 404) {
                    setSolicitudes([]);
                } else {
                    setError("Hubo un problema al conectar con el servidor.");
                }
            } catch (err) {
                setError("No se pudo cargar la información.");
            } finally {
                setLoading(false);
            }
        };
        obtenerDatos();
    }, [dni]);

    if (loading) return (
        <div className="container mt-5 text-center">
            <div className="spinner-border" style={{ color: "#93bbbf" }} role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );

    return (
        <div className="container mt-5 py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold" style={{ color: "#566873" }}>Mis Solicitudes Web</h2>
                    <p className="text-muted">Consulta el estado de tus citas para el DNI: <strong>{dni}</strong></p>
                </div>
                <Link to="/" className="btn text-white shadow-sm" style={{ backgroundColor: "#93bbbf", borderRadius: "10px" }}>
                    <i className="fas fa-home me-2"></i>Volver al Inicio
                </Link>
            </div>

            {error && <div className="alert alert-danger border-0 shadow-sm">{error}</div>}

            {solicitudes.length === 0 && !error ? (
                <div className="text-center p-5 bg-light shadow-sm" style={{ borderRadius: "20px" }}>
                    <i className="fas fa-search fa-3x mb-3 text-muted"></i>
                    <h5 className="text-muted">No hemos encontrado ninguna solicitud pendiente.</h5>
                    <p className="small">Asegúrate de que el DNI sea correcto o solicita una nueva cita.</p>
                </div>
            ) : (
                <div className="row g-3">
                    {solicitudes.map((cita) => (
                        <div className="col-12 col-md-6" key={cita.id}>
                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "15px" }}>
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <span className="badge mb-2" style={{ backgroundColor: "#8ea69b", color: "white" }}>
                                                ID: #{cita.id}
                                            </span>
                                            <h5 className="fw-bold mb-0" style={{ color: "#566873" }}>{cita.reason}</h5>
                                        </div>
                                        <span className={`badge py-2 px-3 rounded-pill ${cita.status === 'pendiente' ? 'bg-warning text-dark' : 'bg-success text-white'}`}>
                                            <i className={`fas ${cita.status === 'pendiente' ? 'fa-clock' : 'fa-check-circle'} me-2`}></i>
                                            {cita.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="border-top pt-3 mt-2">
                                        <p className="mb-1 small text-muted"><i className="fas fa-user me-2"></i>{cita.full_name}</p>
                                        <p className="mb-0 small text-muted"><i className="fas fa-calendar-alt me-2"></i>Solicitada el: {cita.created_at}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-5 p-4 bg-light text-center" style={{ borderRadius: "15px", border: "1px dashed #93bbbf" }}>
                <p className="small text-muted mb-0">
                    <strong>Nota:</strong> Estas solicitudes están pendientes de confirmación telefónica por parte del centro médico.
                </p>
            </div>
        </div>
    );
};