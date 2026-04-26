import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { ListadoMedicos } from "./ListadoMedicos";

export const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();

    const menuItems = [
        { name: "Área personal", path: "/areapersonal", icon: "fas fa-notes-medical" },
        { name: "Estadisticas", path: "/estadisticas", icon: "fas fa-chart-line" },
        { name: "Listado de Pacientes", path: "/pacientes", icon: "fas fa-users" },
        { name: "Listado de Médicos", path: "/equipo", icon: "fas fa-user-md" },        
    ];

    const currentRole = store.role || localStorage.getItem("userRole");

    const itemsFiltrados = store.role === "medico"
        ? menuItems
        : menuItems.filter(item => item.name === "Agenda Médica");

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 shadow"
            style={{ width: "260px", height: "100vh", backgroundColor: "#566873", color: "#ebf2f1", position: "sticky", top: 0 }}>

            <div className="d-flex justify-content-center align-items-center mb-2 mt-2 w-100">
                <img
                    src="/src/front/assets/img/favicon.png"
                    alt="favicon GECAP"
                    style={{ width: "100px", height: "auto", objectFit: "contain" }}
                />
            </div>

            <div className="text-center my-3">
                <p className="mb-0 small opacity-75 text-uppercase fw-bold" style={{ fontSize: "0.6rem" }}>
                    {store.role === "medico" ? "Facultativo" : "Paciente"}
                </p>
                <h6 className="fw-bold" style={{ color: "#b4d2d9" }}>
                    {store.user?.user_name || "Facultativo GECAP"}
                </h6>
                {store.user?.especialidad && (
                    <p className="small mb-0" style={{ fontSize: "0.7rem", color: "#93bbbf" }}>
                        {store.user.especialidad}
                    </p>
                )}
            </div>

            <hr style={{ backgroundColor: "#93bbbf", opacity: 0.5 }} />

            <ul className="nav nav-pills flex-column mb-auto">
                {itemsFiltrados.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <li key={index} className="nav-item">
                            <Link
                                to={item.path}
                                className={`nav-link mb-2 ${isActive ? 'active' : ''}`}
                                style={{
                                    color: isActive ? "#566873" : "#ebf2f1",
                                    backgroundColor: isActive ? "#b4d2d9" : "transparent",
                                    transition: "0.3s"
                                }}
                            >
                                <i className={`${item.icon} me-2`} style={{ color: isActive ? "#566873" : "#e8888c" }}></i>
                                {item.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>           

            <hr style={{ backgroundColor: "#93bbbf", opacity: 0.5 }} />
            <div className="pb-3">
                <button
                    onClick={handleLogout}
                    className="btn btn-link text-decoration-none p-0"
                    style={{ color: "#b4d2d9" }}
                >
                    <i className="fas fa-sign-out-alt me-2"></i> Cerrar Sesión
                </button>
            </div>
        </div>
    );
};