import React, { useContext } from "react";
import { Context } from "../store";
import { useNavigate } from "react-router-dom";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";

export const AgendaMedica = () => {
    const globalState = useContext(Context);
    const navigate = useNavigate();

    const user = globalState?.store?.user || {
        nombre: "Invitado",
        apellido: "",
        email: "",
        MotivoConsulta: ""
    };

    useCalendlyEventListener({
        onEventScheduled: (e) => {
            console.log("¡Cita agendada con éxito!", e.data.payload);
            setTimeout(() => navigate("/mis-citas"), 2000);
        },
    });

    return (
        <div className="container-fluid py-5" style={{ backgroundColor: "#ebf2f1", minHeight: "100vh" }}>
            <div className="container" style={{ maxWidth: "1050px" }}>
                <button
                    onClick={() => navigate("/dashboard")} // 👈 Ajusta la ruta a tu dashboard 
                    className="btn mb-4 d-flex align-items-center"
                    style={{
                        backgroundColor: "#93bbbf",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "8px 16px",
                        fontWeight: "500",
                        transition: "0.3s"
                    }}
                >
                    <i className="fas fa-arrow-left me-2"></i> Volver al Dashboard
                </button>

                <div className="text-center mb-5">
                    <h2 style={{ color: "#566873", fontWeight: "bold", fontSize: "2.5rem" }}>
                        Gestión de Citas Médicas
                    </h2>
                    <div style={{
                        width: "80px",
                        height: "4px",
                        backgroundColor: "#e8888c", 
                        margin: "10px auto",
                        borderRadius: "2px"
                    }}></div>
                    <p style={{ color: "#93bbbf", fontSize: "1.1rem" }}>
                        Hola {user.nombre}, reserve su espacio en nuestra agenda.
                    </p>
                </div>

                <div className="container shadow-lg rounded-4 p-2" style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #b4d2d9", 
                    maxWidth: "1050px"
                }}>
                    <InlineWidget
                        url="https://calendly.com/d/cyqz-v87-srp/reunion-puntual"
                        styles={{ height: "700px" }}
                        prefill={{
                            email: user.email,
                            firstName: user.nombre,
                            lastName: user.apellido
                        }}
                        pageSettings={{
                            backgroundColor: "ffffff",
                            hideEventTypeDetails: false,
                            hideLandingPageDetails: false,
                            primaryColor: "e8888c", 
                            textColor: "566873"  
                        }}
                    />
                </div>
            </div>
        </div>
    );
};