import React, { useState } from "react";

export const CitaRapida = () => {
    const [datos, setDatos] = useState({ 
        nombre: "", 
        dni: "", 
        telefono: "", 
        fecha: "", 
        motivo: "",
        otroMotivo: "" 
    });

    const handleSubmit = async (e) => {
        e.preventDefault();       
        const motivoFinal = datos.motivo === "Otro" ? datos.otroMotivo : datos.motivo;        
       
        const solicitudParaEnviar = {
            nombre: datos.nombre,
            dni: datos.dni, 
            telefono: datos.telefono,
            motivo: `${motivoFinal} (Fecha sugerida: ${datos.fecha})`
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/external-appointment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(solicitudParaEnviar)
            });

            if (response.ok) {     
                alert("¡Solicitud enviada con éxito! El médico contactará contigo.");                       
                setDatos({ nombre: "", dni: "", telefono: "", fecha: "", motivo: "", otroMotivo: "" });
                form.reset(); 
                   
            } else {
                const errorData = await response.json();
                alert("Error: " + (errorData.msg || "No se pudo enviar la solicitud"));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión con el servidor.");
        }
    };

    return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
        <h2 className="text-center mb-4" style={{ color: "#566873" }}>Solicitar Cita Médica</h2>
        <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0 bg-light">
            
            <div className="mb-3">
                <label className="form-label fw-bold">Nombre Completo</label>
                <input type="text" className="form-control" value={datos.nombre} required 
                    onChange={(e) => setDatos({...datos, nombre: e.target.value})} />
            </div>

            <div className="mb-3">
                <label className="form-label fw-bold">DNI / NIE</label>
                <input type="text" className="form-control" value={datos.dni} required 
                    placeholder="12345678Z"
                    onChange={(e) => setDatos({...datos, dni: e.target.value.toUpperCase()})} />
            </div>

            <div className="mb-3">
                <label className="form-label fw-bold">Teléfono</label>
                <input type="tel" className="form-control" value={datos.telefono} required
                    onChange={(e) => setDatos({ ...datos, telefono: e.target.value })} />
            </div>

            <div className="mb-3">
                <label className="form-label fw-bold">Fecha</label>
                <input type="date" className="form-control" value={datos.fecha} required
                    onChange={(e) => setDatos({ ...datos, fecha: e.target.value })} />
            </div>

            <div className="mb-3">
                <label className="form-label fw-bold">Motivo de la Consulta</label>
                <select className="form-select" value={datos.motivo} required
                    onChange={(e) => setDatos({ ...datos, motivo: e.target.value })}>
                    <option value="">Selecciona una opción...</option>
                    <option value="Revision">Revisión General</option>
                    <option value="Urgencia">Urgencia</option>
                    <option value="Analitica">Analítica / Resultados</option>
                    <option value="Otro">Otro (Especificar)</option>
                </select>
            </div>

            {datos.motivo === "Otro" && (
                <div className="mb-3 animate__animated animate__fadeIn">
                    <label className="form-label fw-bold text-muted">Especifique el motivo</label>
                    <textarea
                        className="form-control"
                        rows="2"
                        value={datos.otroMotivo}
                        placeholder="Describa brevemente..."
                        required={datos.motivo === "Otro"}
                        onChange={(e) => setDatos({ ...datos, otroMotivo: e.target.value })}
                    ></textarea>
                </div>
            )}

            <button type="submit" className="btn w-100 mt-3"
                style={{ backgroundColor: "#8ea69b", color: "white", fontWeight: "bold" }}>
                Confirmar Solicitud
            </button>
        </form>
    </div>
);
};