import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export const VerCitaPublica = () => {   
    const { citaId } = useParams(); 
    const [solicitudes, setSolicitudes] = useState([]); // Inicializado como array vacío
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/messages/${citaId}`);
                if (!response.ok) throw new Error("Error en la respuesta");
                
                const data = await response.json();
                // Forzamos que sea un array para que .map() no falle nunca
                setSolicitudes(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error cargando solicitudes:", error);
                setSolicitudes([]);
            } finally {
                setLoading(false);
            }
        };
        if (citaId) cargarDatos();
    }, [citaId]);

    if (loading) return <div className="container mt-5 text-center p-5"><h4>Buscando datos...</h4></div>;

    return (
        <div className="container mt-5 p-4 bg-white shadow-sm" style={{ maxWidth: "600px", borderRadius: "20px" }}>
            <h2 className="text-center mb-4" style={{ color: "#566873" }}>Estado de Solicitudes</h2>
            <p className="text-center mb-4">Consultando DNI: <strong>{citaId}</strong></p>

            {/* Verificamos longitud antes de mapear */}
            {solicitudes && solicitudes.length > 0 ? (
                <div className="list-group border-0">
                    {solicitudes.map((item, index) => (
                        <div key={item.id || index} className="list-group-item mb-3 border shadow-sm p-3" style={{ borderRadius: "12px" }}>
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <div className="fw-bold text-dark">{item.reason || "Consulta General"}</div>
                                    <small className="text-muted d-block mt-1">
                                        <i className="fas fa-calendar-alt me-2"></i>{item.created_at}
                                    </small>
                                </div>
                                <span className={`badge rounded-pill px-3 py-2 ${item.status === 'pendiente' ? 'bg-warning text-dark' : 'bg-success'}`}>
                                    {item.status ? item.status.toUpperCase() : "PENDIENTE"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="alert alert-warning text-center border-0 shadow-sm" style={{ borderRadius: "15px" }}>
                    No se encontraron solicitudes para este documento.
                </div>
            )}

            <div className="text-center mt-4">
                <Link to="/" className="btn btn-outline-secondary btn-sm" style={{ borderRadius: "10px" }}>
                    Volver a Inicio
                </Link>
            </div>
        </div>
    );
};