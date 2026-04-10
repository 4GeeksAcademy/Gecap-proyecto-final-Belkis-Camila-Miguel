import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg shadow-sm" 
             style={{ backgroundColor: "#566873", padding: "0.8rem 2rem" }}>
            <div className="container-fluid">
                
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img src="src/front/assets/img/favicon.png" alt="Logo" width="40" className="me-2" />
                    <span style={{ color: "#ebf2f1", fontWeight: "bold", letterSpacing: "1px" }}>GECAP</span>
                </Link>

                <div className="d-flex gap-3">
                 
                    <Link to="/login" className="btn" 
                        style={{ 
                            backgroundColor: "#5e888c", 
                            color: "#ebf2f1",
                            borderRadius: "8px",
                            padding: "8px 20px"
                        }}>
                        Acceso Plataforma
                    </Link>
                </div>
            </div>
        </nav>
    );
};