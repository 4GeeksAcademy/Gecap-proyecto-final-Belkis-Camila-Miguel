import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

export const ListaPacientes = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);

    const handleNuevoPaciente = () => {
        dispatch({ type: "clear_patient" });
        navigate("/healthform");
    };

    useEffect(() => {
        const fetchPacientes = async () => {
            setCargando(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pacientes`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    dispatch({ type: "set_patients", payload: data });
                }
            } catch (error) {
                console.error("Error al cargar pacientes:", error);
            } finally {
                setCargando(false);
            }
        };
        fetchPacientes();
    }, []);

    const seleccionarPaciente = (paciente) => {
        dispatch({ type: "select_patient", payload: paciente });
        navigate("/paciente");
    };

    const pacientesFiltrados = store.pacientes?.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.dni.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.apellidos?.toLowerCase().includes(busqueda.toLowerCase())
    ) || [];

    return (
        <div className="container-fluid px-2 px-md-4 py-4 animate__animated animate__fadeIn">
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                
                <div className="bg-white p-3 p-md-4 border-bottom">
                    <div className="row g-3 align-items-center">
                        <div className="col-12 col-lg-4 text-center text-lg-start">
                            <h4 className="fw-bold mb-0" style={{ color: "#566873" }}>
                                <i className="fas fa-users me-2"></i>Mis Pacientes
                            </h4>
                        </div>
                        <div className="col-12 col-lg-8">
                            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-lg-end">
                                <div className="position-relative flex-grow-1">
                                    <i className="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                                    <input
                                        type="text"
                                        className="form-control ps-5 border-0 bg-light shadow-sm"
                                        placeholder="Buscar..."
                                        style={{ borderRadius: "10px", height: "45px" }}
                                        value={busqueda}
                                        onChange={(e) => setBusqueda(e.target.value)}
                                    />
                                </div>
                                <button 
                                    className="btn fw-bold shadow-sm text-nowrap px-4" 
                                    style={{ backgroundColor: "#e8888c", color: "white", borderRadius: "12px", height: "45px", border: "none", minWidth: "fit-content" }}
                                    onClick={handleNuevoPaciente}
                                >
                                    <i className="fas fa-user-plus me-2"></i> Nuevo Paciente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    {cargando ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-info" role="status" style={{ color: "#b4d2d9" }}>
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-2 text-muted small">Cargando historial...</p>
                        </div>
                    ) : (
                        <table className="table table-hover align-middle mb-0 bg-white">
                            <thead className="table-light">
                                <tr className="small text-uppercase" style={{ color: "#566873" }}>
                                    <th className="ps-4">Identificación</th>
                                    <th className="d-none d-md-table-cell">DNI / NIE</th>
                                    <th>Alertas</th>
                                    <th className="text-end pe-4">Gestión</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pacientesFiltrados.length > 0 ? (
                                    pacientesFiltrados.map((p) => (
                                        <tr key={p.id} onClick={() => seleccionarPaciente(p)} style={{ cursor: "pointer" }}>
                                            <td className="ps-4 py-3">
                                                <div className="fw-bold text-dark text-truncate" style={{ maxWidth: "180px" }}>{p.nombre} {p.apellidos}</div>
                                                <small className="text-muted d-block">{p.email}</small>
                                            </td>
                                            <td className="d-none d-md-table-cell text-muted small">{p.dni}</td>
                                            <td>
                                                <div className="d-flex gap-1 flex-wrap">
                                                    {p.embarazo === "SI" && <span className="badge bg-danger rounded-pill" title="Embarazo"><i className="fas fa-baby"></i></span>}
                                                    {(p.alergia_penicilina === "SI" || p.alergia_latex === "SI") && <span className="badge bg-warning text-dark rounded-pill" title="Alergias"><i className="fas fa-allergies"></i></span>}
                                                    {p.embarazo !== "SI" && p.alergia_penicilina !== "SI" && <span className="badge bg-success opacity-50 rounded-pill fw-normal">Sano</span>}
                                                </div>
                                            </td>
                                            <td className="text-end pe-4">                                              
                                                <div className="d-flex justify-content-end align-items-center gap-2" style={{ minWidth: "120px" }}>
                                                    <button className="btn btn-sm btn-outline-primary rounded-pill px-3 border-2 fw-bold" style={{ color: "#566873", borderColor: "#b4d2d9" }}>
                                                        Ver <span className="d-none d-md-inline">Ficha</span>
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm text-danger border-0" 
                                                        onClick={(e) => { e.stopPropagation(); }}
                                                    >
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5 text-muted small">
                                            No se han encontrado registros médicos.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};