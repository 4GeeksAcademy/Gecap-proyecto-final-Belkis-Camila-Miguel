import React, { useState } from "react";
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const Estadisticas = () => {
    const [modo, setModo] = useState("listado"); 

    // --- CONFIGURACIÓN DE CHART.JS ---
 const dataGrafica = {
    labels: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'],
    datasets: [
        {
            label: 'Citas',
            data:[12, 19, 3, 5, 2, 3],
            backgroundColor: '#e8888c', 
            borderRadius: 10,           
            hoverBackgroundColor: '#566873', 
        },
    ],
};

const opcionesGrafica = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false }, 
        tooltip: {
            backgroundColor: '#566873',
            titleColor: '#ffffff',
            padding: 10,
            cornerRadius: 10
        }
    },
    scales: {
        y: { 
            beginAtZero: true,
            grid: { color: 'rgba(147, 187, 191, 0.1)' }, 
            ticks: { color: '#566873' } 
        },
        x: { 
            grid: { display: false }, 
            ticks: { color: '#566873', font: { weight: 'bold' } } 
        }
    }
    };

    // --- RENDERIZADO DEL DASHBOARD (LISTADO) ---
    if (modo === "listado") {
        return (
            <div className="container-fluid animate__animated animate__fadeIn">
                <div className="row mb-4">
                    {/* Tarjeta Gráfica */}
                    <div className="col-md-8">
                        <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: "20px" }}>
                            <h5 className="fw-bold" style={{ color: "#566873" }}>Consultas del Día</h5>
                            <div style={{ height: "200px" }}>
                                <Bar data={dataGrafica} options={opcionesGrafica} />
                            </div>
                        </div>
                    </div>
                    {/* Tarjeta Resumen */}
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm p-4 text-white h-100 text-center d-flex flex-column justify-content-center" style={{ backgroundColor: "#566873", borderRadius: "20px" }}>
                            <h2 className="display-4 fw-bold">1</h2>
                            <p className="opacity-75">Pacientes Agendados</p>
                            <button className="btn w-100 fw-bold" style={{ backgroundColor: "#93bbbf", color: "white" }} onClick={() => setModo("atender")}>
                                + Nueva Consulta
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabla de Pacientes */}
                <div className="card border-0 shadow-sm" style={{ borderRadius: "20px" }}>
                    <div className="table-responsive p-3">
                        <table className="table table-hover align-middle">
                            <thead>
                                <tr style={{ color: "#566873" }}>
                                    <th>Hora</th>
                                    <th>Paciente</th>
                                    <th>Motivo</th>
                                    <th className="text-end">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="fw-bold">09:00</td>
                                    <td>Juan Pérez</td>
                                    <td>Control rutinario</td>
                                    <td className="text-end">
                                        <button className="btn btn-sm text-white px-3" style={{ backgroundColor: "#e8888c" }} onClick={() => setModo("atender")}>Atender</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDERIZADO DEL FORMULARIO DE CONSULTA ---
    return (
        <div className="container-fluid animate__animated animate__fadeIn">
            <button className="btn btn-link text-decoration-none mb-3 p-0" style={{ color: "#566873" }} onClick={() => setModo("listado")}>
                <i className="fas fa-arrow-left me-2"></i> Volver al listado
            </button>

            <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white shadow-sm rounded-pill border-start border-5" style={{ borderColor: "#e8888c" }}>
                <h4 className="mb-0 fw-bold" style={{ color: "#566873" }}>Atención Médica: Juan Pérez</h4>
                <button className="btn text-white rounded-pill px-4" style={{ backgroundColor: "#e8888c" }} onClick={() => setModo("listado")}>Finalizar</button>
            </div>

            <div className="row">
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm p-3 mb-4" style={{ borderRadius: "15px" }}>
                        <h6 className="fw-bold" style={{ color: "#93bbbf" }}>Signos Vitales</h6>
                        <input type="text" className="form-control form-control-sm mb-2 border-0 bg-light" placeholder="Tensión" />
                        <input type="text" className="form-control form-control-sm mb-2 border-0 bg-light" placeholder="Peso" />
                        <input type="text" className="form-control form-control-sm border-0 bg-light" placeholder="Temp" />
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "15px" }}>
                        <label className="fw-bold mb-2">Evolución / Notas</label>
                        <textarea className="form-control border-0 bg-light mb-4" rows="5"></textarea>
                        <label className="fw-bold mb-2">Diagnóstico y Receta</label>
                        <textarea className="form-control border-0 bg-light" rows="3"></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
};