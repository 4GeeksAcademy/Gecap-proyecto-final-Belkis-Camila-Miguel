import React, { useState } from 'react';

function ModalCitas({ cita, onClose, onActualizarCita, pacientesHoy }) {
    const [descargarDoc, setDescargarDoc] = useState(false);
    const [descargarJustificante, setDescargarJustificante] = useState(false)

    const historialAsistencia = pacientesHoy.filter(p =>
        p.nombre === cita.nombre && p.patient_id === cita.patient_id && (p.status === "asistio" || p.status === "no asistio")
    )
    const citasContadas = historialAsistencia.length
    const noAsistio = historialAsistencia.filter(p => p.status === "no asistio").length
    const probabilidadFaltar = citasContadas > 0 ? (noAsistio / citasContadas) * 100 : 0
    const altoRiesgo = probabilidadFaltar > 50

    const handleOnActualizarEstado = (status) => {
        onActualizarCita(cita.id, {
            ...cita,
            status: status,
            nombre: cita.nombre,
        })
        console.log(status, cita)
    }

    const firmarPdf = async () => {
        setDescargarDoc(true);

        const data = {

            "data": {
                "date": cita.start ? new Date(cita.start).toLocaleDateString() : "---",
            },
            "template_id": "2e377b2354808d98",
            "export_type": "json",
            "expiration": 60,
            "load_async": false

        };

        try {
            const response = await fetch("https://api.craftmypdf.com/v1/create", {
                method: "POST",
                headers: {
                    "X-API-KEY": "0512MzAzODY6MzA1OTU6RnRHd2xwZDI4bUZZR1diOA=",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor");
            }
            const responseBody = await response.json();
            window.open(responseBody.file);

        } catch (error) {
            console.error("Error detallado:", error);
            alert("No se pudo generar o descargar el PDF");
        } finally {
            setDescargarDoc(false);
        }
    };
    const justificantePdf = async () => {
        setDescargarJustificante(true);

        const data = {

            "data": {
                "date": cita.start ? new Date(cita.start).toLocaleDateString() : "---",
            },
            "template_id": "47d77b235484b33c",
            "export_type": "json",
            "expiration": 60,
            "load_async": false

        };

        try {
            const response = await fetch("https://api.craftmypdf.com/v1/create", {
                method: "POST",
                headers: {
                    "X-API-KEY": "0512MzAzODY6MzA1OTU6RnRHd2xwZDI4bUZZR1diOA=",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor");
            }
            const responseBody = await response.json();
            window.open(responseBody.file);

        } catch (error) {
            console.error("Error detallado:", error);
            alert("No se pudo generar o descargar el PDF");
        } finally {
            setDescargarJustificante(false);
        }
    };

    return (
        <div>
            <div className="modal show modal-xl bg-dark bg-opacity-75 d-block" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <button type="button" className="btn-close d-flex justify-content-between" aria-label="Close" onClick={onClose}></button>
                            <div className="m-4">
                                {citasContadas > 0 ? (
                                    <div className={`p-2 rounded-3 ${altoRiesgo ? 'bg-danger-subtle border border-danger' : 'bg-success-subtle border border-success'}`}>
                                        <p className="mb-0 fw-medium" style={{ color: altoRiesgo ? '#842029' : '#0f5132' }}>
                                            {altoRiesgo ? 'Alta probabilidad de inasistencia' : 'Paciente confiable'}
                                        </p>
                                        <small className="text-muted">
                                            Ha faltado a {noAsistio} de {citasContadas} citas previas ({Math.round(probabilidadFaltar)}%)
                                        </small>
                                    </div>
                                ) : (
                                    <span className="badge bg-light text-dark border">Primera cita o sin historial</span>
                                )}
                            </div>
                        <div className="modal-footer d-flex justify-content-center gap-2 text-light">
                            <button type="button"
                                className="btn shadow-sm text-light"
                                style={{ backgroundColor: "#5e888c" }} onClick={() => handleOnActualizarEstado("asistio")}> Asistio

                            </button>
                            <button
                                type="button"
                                className="btn shadow-sm text-light"
                                style={{ backgroundColor: "#5e888c" }} onClick={() => handleOnActualizarEstado("no asistio")}> No Asistió
                            </button>
                             <button
                                type="button"
                                className="btn shadow-sm text-light"
                                style={{ backgroundColor: "#5e888c" }} onClick={() => handleOnActualizarEstado("pendiente")}> Pendiente
                            </button>
                            <button type="button"
                                className="btn shadow-sm text-light"
                                style={{ backgroundColor: "#566873" }}
                                onClick={justificantePdf} disabled={descargarJustificante}>
                                {descargarJustificante ? "Descargando..." : "Justificante"}</button>
                            <button
                                type="button"
                                className="btn shadow-sm text-light"
                                style={{ backgroundColor: "#566873" }}
                                onClick={firmarPdf}
                                disabled={descargarDoc}                            >
                                {descargarDoc ? "Descargando..." : "Proteccion datos"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalCitas;
