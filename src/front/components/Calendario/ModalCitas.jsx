import React, { useState } from 'react';

function ModalCitas({ paciente, onClose, onMarcarAsistencia }) {
    const [descargarDoc, setDescargarDoc] = useState(false);
    const [descargarJustificante, setDescargarJustificante] = useState(false)

    const firmarPdf = async () => {
        setDescargarDoc(true);

        const data = {

            "data": {
                "date": paciente.start ? new Date(paciente.start).toLocaleDateString() : "---",
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
                "date": paciente.start ? new Date(paciente.start).toLocaleDateString() : "---",
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
                        <div className="modal-header">
                            <h5 className="modal-title">Paciente</h5>
                            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
                        </div>
                        <div className="modal-footer d-flex justify-content-center gap-2 text-light">
                            <button type="button"
                                className="btn shadow-sm text-light"
                                style={{ backgroundColor: "#5e888c" }} > Asistio
                            </button>
                            <button
                                type="button"
                                className="btn shadow-sm text-light"
                                style={{ backgroundColor: "#5e888c" }}
                                  > No Asistió
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
