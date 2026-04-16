import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";


export const ListaPacientes = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        const fetchPacientes = async () => {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pacientes`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                dispatch({ type: "set_patients", payload: data });
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

    const handleEliminar = async (e, id) => {
        e.stopPropagation();

        if (!window.confirm("¿Confirmas que deseas eliminar permanentemente este paciente?")) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pacientes/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.ok) {
                dispatch({ type: "delete_patient", payload: id });
            } else {
                alert("No se pudo eliminar el paciente.");
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    return (
        <div className="container py-5">
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden">

                {/* ENCABEZADO CON BUSCADOR */}
                <div className="bg-white p-4 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <h4 className="fw-bold mb-0" style={{ color: "#566873" }}>
                        <i className="fas fa-users me-2"></i>Listado de Pacientes
                    </h4>

                    <div className="position-relative" style={{ width: "100%", maxWidth: "400px" }}>
                        <i className="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                        <input
                            type="text"
                            className="form-control ps-5 border-2 rounded-pill shadow-sm"
                            placeholder="Buscar por Nombre o DNI..."
                            style={{ borderColor: "#b4d2d9" }}
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0 bg-white">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Paciente</th>
                                <th>DNI / NIE</th>
                                <th>Estado Crítico</th>
                                <th className="text-end pe-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store.pacientes?.length > 0 ? (
                                store.pacientes.map((p) => (
                                    <tr key={p.id} style={{ cursor: "pointer" }} onClick={() => seleccionarPaciente(p)}>
                                        <td className="ps-4 py-3">
                                            <div className="fw-bold text-dark">{p.nombre} {p.apellidos}</div>
                                            <small className="text-muted">{p.email}</small>
                                        </td>
                                        <td>{p.dni}</td>
                                        <td>
                                            <div className="d-flex gap-1 flex-wrap">
                                                {/* Alerta de Embarazo */}
                                                {p.embarazo === "SI" && (
                                                    <span className="badge bg-danger rounded-pill shadow-sm" title="Paciente Embarazada">
                                                        <i className="fas fa-baby me-1"></i> Embarazo
                                                    </span>
                                                )}

                                                {/* Alerta de Alergias */}
                                                {(p.alergia_penicilina === "SI" || p.alergia_latex === "SI" || p.alergia_anestesia === "SI") && (
                                                    <span className="badge bg-warning text-dark rounded-pill shadow-sm" title="Alergias Detectadas">
                                                        <i className="fas fa-exclamation-circle me-1"></i> Alergias
                                                    </span>
                                                )}

                                                {/* Alerta de Bioseguridad (VIH, Hepatitis, etc) */}
                                                {(p.vih === "SI" || p.hepatitis === "SI" || p.tuberculosis === "SI") && (
                                                    <span className="badge bg-info text-dark rounded-pill shadow-sm" title="Riesgo Biológico">
                                                        <i className="fas fa-biohazard me-1"></i> Bioseguridad
                                                    </span>
                                                )}

                                                {p.embarazo !== "SI" && p.alergia_penicilina !== "SI" && p.vih !== "SI" && (
                                                    <span className="badge bg-success opacity-75 rounded-pill fw-normal">
                                                        Estable
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="text-end pe-4">
                                            <button
                                                className="btn btn-sm btn-outline-primary rounded-pill px-3 shadow-sm"
                                                onClick={() => seleccionarPaciente(paciente)}
                                            >
                                                Ver Ficha <i className="fas fa-chevron-right ms-1"></i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger ms-2" onClick={(e) => handleEliminar(e, p.id)}>
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-5 text-muted">
                                        No hay pacientes registrados aún.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};