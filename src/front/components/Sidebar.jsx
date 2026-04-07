import React from "react";
import { Link, useLocation } from "react-router-dom";

export const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { name: "Consultas", path: "/", icon: "fas fa-notes-medical" },
        { name: "Agenda Médica", path: "/agenda", icon: "fas fa-calendar-alt" },
        { name: "Alta de Paciente", path: "/healthform", icon: "fas fa-user-plus" },
        { name: "Ficha de Paciente", path: "/paciente", icon: "fas fa-id-card-alt" },
    ];

    return (
      <div className="d-flex flex-column flex-shrink-0 p-3 shadow"
    style={{ width: "260px", height: "100vh", backgroundColor: "#566873", color: "#ebf2f1", position: "sticky", top: 0 }}>

    {/* Contenedor del Logo Centrado */}
    <div className="d-flex justify-content-center align-items-center mb-5 mt-2 w-100">
        <img
            src="/Logo-GECAP-vertical.png"
            alt="Logo GECAP"
            style={{ 
                width: "180px",      // He aumentado el ancho para que se lea mejor al ser vertical
                height: "auto",      // 'auto' mantiene la proporción original
                objectFit: "contain" 
            }}
        />
    </div>

    <hr style={{ backgroundColor: "#93bbbf", opacity: 0.5 }} />

            <ul className="nav nav-pills flex-column mb-auto">
                {menuItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <li key={index} className="nav-item">
                            <Link to={item.path}
                                className={`nav-link mb-2 ${isActive ? 'active' : ''}`}
                                style={{
                                    color: isActive ? "#566873" : "#ebf2f1",
                                    backgroundColor: isActive ? "#b4d2d9" : "transparent",
                                    transition: "0.3s"
                                }}>
                                <i className={`${item.icon} me-2`} style={{ color: isActive ? "#566873" : "#e8888c" }}></i>
                                {item.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <hr />
            <div className="pb-3">
                <Link to="/login" className="text-decoration-none" style={{ color: "#b4d2d9" }}>
                    <i className="fas fa-sign-out-alt me-2"></i> Cerrar Sesión
                </Link>
            </div>
        </div>
    );
};