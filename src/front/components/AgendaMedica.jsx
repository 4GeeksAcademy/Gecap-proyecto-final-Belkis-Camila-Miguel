import React from "react";
import { InlineWidget } from "react-calendly";

export const AgendaMedica = () => {
    return (
        <div className="container-fluid py-5" style={{ backgroundColor: "#ebf2f1", minHeight: "100vh" }}>
            <div className="text-center mb-4">
                <h2 style={{ color: "#566873", fontWeight: "bold" }}>Gestión de Citas Médicas</h2>
                <p style={{ color: "#93bbbf" }}>Seleccione un horario disponible para su consulta.</p>
            </div>
            
            <div className="shadow-sm rounded overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
                <InlineWidget
                    url="https://calendly.com" // ⚠️ Cambiar esto por mi URL de Calendly
                    styles={{
                        height: "700px",
                        minWidth: "320px"
                    }}
                    pageSettings={{
                        backgroundColor: "ebf2f1",
                        hideEventTypeDetails: false,
                        hideLandingPageDetails: false,
                        primaryColor: "e8888c", // Color de botones y fechas
                        textColor: "566873"     // Color de los textos
                    }}
                />
            </div>
        </div>
    );
};