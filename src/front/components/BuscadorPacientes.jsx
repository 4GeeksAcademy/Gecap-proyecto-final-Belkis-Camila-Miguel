import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

export const BuscadorPacientes = () => {
    const { store, dispatch } = useGlobalReducer();
    const [busqueda, setBusqueda] = useState("");
    const navigate = useNavigate();

    const resultados = store.pacientes.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.dni.includes(busqueda)
    );

    const seleccionar = (paciente) => {
        dispatch({ type: "select_patient", payload: paciente });
        setBusqueda(""); 
        navigate("/paciente");
    };

    return (
        <div className="position-relative w-100" style={{ maxWidth: "400px" }}>
            <div className="input-group shadow-sm rounded-3 overflow-hidden">
                <span className="input-group-text bg-white border-0">
                    <i className="fas fa-search text-muted"></i>
                </span>
                <input
                    type="text"
                    className="form-control border-0 ps-0"
                    placeholder="Buscar paciente por nombre o DNI..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{ boxShadow: "none", fontSize: "0.9rem" }}
                />
            </div>

            {/* LISTA DESPLEGABLE DE RESULTADOS */}
            {busqueda.length > 0 && (
                <ul className="list-group position-absolute w-100 shadow-lg mt-1" style={{ zIndex: 1000, maxHeight: "300px", overflowY: "auto" }}>
                    {resultados.length > 0 ? (
                        resultados.map((p, index) => (
                            <li
                                key={index}
                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center cp"
                                onClick={() => seleccionar(p)}
                                style={{ cursor: "pointer" }}
                            >
                                <div>
                                    <div className="fw-bold small text-dark">{p.nombre} {p.apellidos}</div>
                                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>DNI: {p.dni}</div>
                                </div>
                                {/* Icono de aviso si tiene alergias para verlo antes de entrar */}
                                {(p.alergia_penicilina === "SI" || p.alergia_anestesia === "SI" || p.alergia_otros) && (
                                    <i className="fas fa-exclamation-triangle text-danger" title="Paciente con alergias"></i>
                                )}
                            </li>
                        ))
                    ) : (
                        <li className="list-group-item small text-muted text-center py-3">
                            No se encontraron resultados
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};