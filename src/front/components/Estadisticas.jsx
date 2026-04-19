import React, { useState, useMemo, useEffect } from "react";
import { Bar, Pie } from 'react-chartjs-2';
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export const Estadisticas = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [modo, setModo] = useState("listado");

    const [tipoPeriodo, setTipoPeriodo] = useState("semana");
    const [fechaReferencia, setFechaReferencia] = useState(new Date().toISOString().split('T')[0]);
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [pacientesSeleccionados, setPacientesSeleccionados] = useState([]);
    const [busquedaTabla, setBusquedaTabla] = useState("");
    const [filtroTarta, setFiltroTarta] = useState("motivo");

    const togglePaciente = (paciente) => {
        const existe = pacientesSeleccionados.find(p => p.id === paciente.id);
        if (existe) {
            setPacientesSeleccionados(pacientesSeleccionados.filter(p => p.id !== paciente.id));
        } else if (pacientesSeleccionados.length < 6) {
            setPacientesSeleccionados([...pacientesSeleccionados, paciente]);
        }
    };

    useEffect(() => {
        const cargarDatosEstadisticos = async () => {
            const token = localStorage.getItem("token");
            const headers = { "Authorization": `Bearer ${token}` };

            try {

                if (store.pacientes && store.pacientes.length === 0) {
                    const resP = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pacientes`, { headers });
                    if (resP.ok) {
                        const dataP = await resP.json();
                        dispatch({ type: "set_patients", payload: dataP });
                    }
                }

                const resC = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/appointments`, { headers });
                if (resC.ok) {
                    const dataC = await resC.json();

                    dispatch({ type: "set_appointments", payload: dataC });
                }
            } catch (error) {
                console.error("Error al cargar datos:", error);
            }
        };
        cargarDatosEstadisticos();
    }, []);

    const dataGrafica = useMemo(() => {
        const config = {
            semana: { labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'], key: 'day' },
            mes: { labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'], key: 'week' },
            año: { labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'], key: 'month' },
            rango: { labels: ['Consultas'], key: 'total' }
        };

        const actual = config[tipoPeriodo];
        const consultas = store.appointments || [];

        const obtenerConteo = (idPaciente = null) => {
            return actual.labels.map((label, index) => {
                const filtradas = consultas.filter(cita => {

                    const fechaCita = new Date(cita.date);

                    if (idPaciente && cita.patient_id !== idPaciente) return false;
                    if (tipoPeriodo === "año") return fechaCita.getMonth() === index;
                    if (tipoPeriodo === "semana") {

                        const diaSemana = fechaCita.getDay();
                        const diaAjustado = diaSemana === 0 ? 6 : diaSemana - 1;
                        return diaAjustado === index;
                    }

                    return true;
                });
                return filtradas.length;
            });
        };

        const datasets = pacientesSeleccionados.length > 0
            ? pacientesSeleccionados.map((p, index) => ({
                label: p.nombre,
                data: obtenerConteo(p.id),
                backgroundColor: ['#e8888c', '#93bbbf', '#566873', '#f2c0a2', '#a2d2ff', '#d1d1d1'][index],
                borderRadius: 5,
            }))
            : [{
                label: 'Total Consultas',
                data: obtenerConteo(),
                backgroundColor: '#e8888c',
                borderRadius: 8,
            }];

        return { labels: actual.labels, datasets };
    }, [tipoPeriodo, fechaReferencia, fechaInicio, fechaFin, pacientesSeleccionados, store.appointments]);

    const opcionesGrafica = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
            x: { grid: { display: false } }
        }
    };

    const dataTarta = useMemo(() => {
        const consultas = store.appointments || [];
        const pacientes = store.pacientes || [];

        let etiquetas = [];
        let conteo = [];

        if (filtroTarta === "motivo") {
            etiquetas = [...new Set(consultas.map(c => c.reason || "Sin especificar"))];
            conteo = etiquetas.map(m => consultas.filter(c => (c.reason || "Sin especificar") === m).length);
        }
        else if (filtroTarta === "alertas") {
            etiquetas = ['Alergias', 'Embarazo', 'Bioseguridad', 'Sin Riesgo'];
            const conAlergia = pacientes.filter(p => p.alergia_penicilina === "SI" || p.alergia_latex === "SI").length;
            const conEmbarazo = pacientes.filter(p => p.embarazo === "SI").length;
            const conBio = pacientes.filter(p => p.vih === "SI" || p.hepatitis === "SI").length;
            const sanos = pacientes.length - (conAlergia + conEmbarazo + conBio);
            conteo = [conAlergia, conEmbarazo, conBio, sanos > 0 ? sanos : 0];
        }
        else if (filtroTarta === "genero") {
            etiquetas = ['Masculino', 'Femenino', 'Otros'];
            conteo = [
                pacientes.filter(p => p.sexo === "M").length,
                pacientes.filter(p => p.sexo === "F").length,
                pacientes.filter(p => p.sexo === "O").length
            ];
        }

        return {
            labels: etiquetas,
            datasets: [{
                data: conteo.length > 0 ? conteo : [1],
                backgroundColor: ['#93bbbf', '#e8888c', '#566873', '#f2c0a2'],
                borderWidth: 0,
            }],
        };
    }, [store.appointments, store.pacientes, filtroTarta]);

    const totalConsultas = useMemo(() => {
        let suma = 0;
        dataGrafica.datasets.forEach(dataset => {
            suma += dataset.data.reduce((a, b) => a + b, 0);
        });
        return suma;
    }, [dataGrafica]);

    if (modo === "listado") {
        return (
            <div className="container-fluid p-4 animate__animated animate__fadeIn" style={{ backgroundColor: "#f4f7f6", minHeight: "100vh" }}>

                <div className="card border-0 shadow-sm p-3 mb-4" style={{ borderRadius: "20px" }}>
                    <div className="row g-2 align-items-end">

                        <div className="col-lg-3 col-md-12">
                            <label className="small fw-bold mb-1 d-block text-muted" style={{ fontSize: '0.7rem' }}>MODO:</label>
                            <div className="btn-group w-100 shadow-sm" style={{ borderRadius: "10px", overflow: "hidden" }}>
                                {['semana', 'mes', 'año', 'rango'].map((p) => (
                                    <button
                                        key={p}
                                        className={`btn btn-sm py-2 fw-bold ${tipoPeriodo === p ? 'btn-dark' : 'btn-light'}`}
                                        style={{ border: "none", fontSize: "0.65rem", backgroundColor: tipoPeriodo === p ? "#566873" : "#fff" }}
                                        onClick={() => setTipoPeriodo(p)}
                                    >
                                        {p.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="col-lg-5 col-md-6">
                            <label className="small fw-bold mb-1 d-block text-muted" style={{ fontSize: '0.7rem' }}>FECHA / PERIODO:</label>
                            {tipoPeriodo === "rango" ? (
                                <div className="d-flex gap-2">
                                    <input type="date" className="form-control form-control-sm border-0 bg-light shadow-sm" style={{ borderRadius: "10px" }} value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                                    <input type="date" className="form-control form-control-sm border-0 bg-light shadow-sm" style={{ borderRadius: "10px" }} value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                                </div>
                            ) : tipoPeriodo === "año" ? (
                                <select
                                    className="form-select form-select-sm border-0 bg-light shadow-sm text-center"
                                    style={{ borderRadius: "10px", height: "35px", fontWeight: "bold", color: "#566873" }}
                                    value={fechaReferencia}
                                    onChange={(e) => setFechaReferencia(e.target.value)}
                                >
                                    {Array.from({ length: 2035 - 2015 + 1 }, (_, i) => 2015 + i).map((anio) => (
                                        <option key={anio} value={anio}>{anio}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={tipoPeriodo === 'mes' ? "month" : "date"}
                                    className="form-control form-control-sm border-0 bg-light shadow-sm text-center"
                                    style={{ borderRadius: "10px", height: "35px", fontWeight: "bold", color: "#566873" }}
                                    value={fechaReferencia}
                                    onChange={(e) => setFechaReferencia(e.target.value)}
                                />
                            )}
                        </div>

                        <div className="col-lg-4 col-md-6">
                            <label className="small fw-bold mb-1 d-block text-muted" style={{ fontSize: '0.7rem' }}>PACIENTES:</label>
                            <div className="dropdown">
                                <button className="btn btn-sm btn-white w-100 shadow-sm text-start d-flex justify-content-between align-items-center border-0" type="button" data-bs-toggle="dropdown" style={{ borderRadius: "10px", height: "35px", backgroundColor: "white" }}>
                                    <span className="text-truncate" style={{ fontSize: '0.8rem' }}>
                                        {pacientesSeleccionados.length === 0 ? "Todos los pacientes" : `${pacientesSeleccionados.length} seleccionados`}
                                    </span>
                                    <i className="fas fa-chevron-down text-muted small"></i>
                                </button>
                                <ul className="dropdown-menu w-100 border-0 shadow-lg p-2" style={{ borderRadius: "15px", maxHeight: "250px", overflowY: "auto" }}>
                                    <li>
                                        <button className="dropdown-item rounded fw-bold text-primary" onClick={() => setPacientesSeleccionados([])} style={{ fontSize: '0.8rem' }}>
                                            Ver Todos (Global)
                                        </button>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    {store.pacientes && store.pacientes.map(p => (
                                        <li key={p.id} className="dropdown-item d-flex align-items-center rounded py-1" onClick={(e) => e.stopPropagation()} style={{ fontSize: '0.8rem' }}>
                                            <input
                                                type="checkbox"
                                                className="form-check-input me-2"
                                                checked={pacientesSeleccionados.some(sel => sel.id === p.id)}
                                                onChange={() => togglePaciente(p)}
                                            />
                                            {p.nombre} {p.apellidos}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DASHBOARD PRINCIPAL */}
                <div className="row mb-4">
                    <div className="col-md-9">
                        <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: "20px" }}>
                            <div className="d-flex justify-content-between align-items-start mb-4">
                                <h5 className="fw-bold m-0" style={{ color: "#566873" }}>Consultas Realizadas</h5>
                                <div className="d-flex flex-wrap gap-1 justify-content-end" style={{ maxWidth: '60%' }}>
                                    {pacientesSeleccionados.map(p => (
                                        <span key={p.id} className="badge rounded-pill d-flex align-items-center" style={{ backgroundColor: "#93bbbf", fontSize: "0.65rem", padding: "6px 10px" }}>
                                            {p.nombre}
                                            <i className="fas fa-times ms-2" style={{ cursor: "pointer" }} onClick={() => togglePaciente(p)}></i>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div style={{ height: "300px" }}>
                                <Bar data={dataGrafica} options={opcionesGrafica} />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm p-4 text-white h-100 text-center d-flex flex-column" style={{ backgroundColor: "#566873", borderRadius: "20px" }}>
                            <div className="pt-5 mb-4">
                                <h2 className="display-4 fw-bold mb-0">{totalConsultas}</h2>
                                <p className="opacity-75 small">
                                    {pacientesSeleccionados.length === 0 ? `Consultas totales (${tipoPeriodo})` : `Consultas de selección (${tipoPeriodo})`}
                                </p>
                            </div>
                            <div className="d-grid gap-2 mt-auto">
                                <button
                                    className="btn btn-sm fw-bold shadow-sm py-2"
                                    style={{ backgroundColor: "#93bbbf", color: "white", borderRadius: "12px" }}
                                    onClick={() => setModo("detalle")}
                                >
                                    <i className="fas fa-chart-pie me-2"></i> Ver Detalles
                                </button>
                                <button className="btn btn-sm fw-bold shadow-sm py-2" style={{ backgroundColor: "#ffffff", color: "#566873", borderRadius: "12px" }} onClick={() => window.print()}>
                                    <i className="fas fa-print me-2"></i> Imprimir Informe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card border-0 shadow-sm" style={{ borderRadius: "20px" }}>
                    <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                        <h6 className="fw-bold m-0" style={{ color: "#566873" }}>Listado de Pacientes y Consultas</h6>
                        <div className="input-group input-group-sm" style={{ width: "250px" }}>
                            <span className="input-group-text bg-light border-0" style={{ borderRadius: "10px 0 0 10px" }}>
                                <i className="fas fa-search text-muted"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control border-0 bg-light"
                                placeholder="Buscar paciente..."
                                style={{ borderRadius: "0 10px 10px 0" }}
                                value={busquedaTabla}
                                onChange={(e) => setBusquedaTabla(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="table-responsive p-3">
                        <table className="table table-hover align-middle">
                            <thead className="text-muted small">
                                <tr>
                                    <th className="ps-3">FECHA/HORA</th>
                                    <th>PACIENTE</th>
                                    <th>MOTIVO</th>
                                    <th>ESTADO</th>
                                    <th className="text-end pe-3">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {store.pacientes && store.pacientes
                                    .filter(p => p.nombre.toLowerCase().includes(busquedaTabla.toLowerCase()))
                                    .map((paciente) => (
                                        <tr key={paciente.id}>
                                            <td className="ps-3">
                                                <div className="fw-bold small">17 Abr, 2024</div>
                                                <div className="text-muted" style={{ fontSize: "0.7rem" }}>09:00 AM</div>
                                            </td>
                                            <td>
                                                <div className="fw-bold small" style={{ color: "#566873" }}>{paciente.nombre}</div>
                                                <div className="text-muted" style={{ fontSize: "0.7rem" }}>ID: #{paciente.id.toString().padStart(4, '0')}</div>
                                            </td>
                                            <td className="small text-muted">Control rutinario post-operatorio</td>
                                            <td>
                                                <span className="badge" style={{ backgroundColor: "rgba(147, 187, 191, 0.2)", color: "#93bbbf", fontSize: "0.65rem" }}>Completado</span>
                                            </td>
                                            <td className="text-end pe-3">
                                                <div className="d-flex gap-2 justify-content-end">
                                                    <button
                                                        className="btn btn-sm shadow-sm text-white"
                                                        style={{ backgroundColor: "#93bbbf", borderRadius: "8px", border: "none" }}
                                                        onClick={() => {
                                                            dispatch({ type: "select_patient", payload: paciente });
                                                            navigate("/paciente");
                                                        }}
                                                    >
                                                        <i className="fas fa-eye me-1"></i> Detalle
                                                    </button>
                                                    <button
                                                        className="btn btn-sm shadow-sm text-white"
                                                        style={{ backgroundColor: "#566873", borderRadius: "8px", border: "none" }}
                                                        onClick={() => window.print()}
                                                    >
                                                        <i className="fas fa-print me-1"></i> Informe
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid p-4 animate__animated animate__fadeIn">
            <button
                className="btn btn-link text-decoration-none mb-3 p-0"
                style={{ color: "#566873" }}
                onClick={() => setModo("listado")}
            >
                <i className="fas fa-arrow-left me-2"></i> Volver a la gráfica
            </button>

            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: "20px" }}>
                <h4 className="fw-bold mb-4" style={{ color: "#566873" }}>Análisis Detallado de Consultas</h4>

                <div className="row mb-4">
                    <div className="col-md-4 mb-3">
                        <div className="p-3 bg-light rounded-4 text-center border-0 shadow-sm">
                            <h6 className="text-muted small text-uppercase fw-bold">Promedio Diario</h6>
                            <h3 className="fw-bold" style={{ color: "#e8888c" }}>4.2</h3>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="p-3 bg-light rounded-4 text-center border-0 shadow-sm">
                            <h6 className="text-muted small text-uppercase fw-bold">Pico de Consultas</h6>
                            <h3 className="fw-bold" style={{ color: "#93bbbf" }}>Martes</h3>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="p-3 bg-light rounded-4 text-center border-0 shadow-sm">
                            <h6 className="text-muted small text-uppercase fw-bold">Motivo más frecuente</h6>
                            <h3 className="fw-bold" style={{ color: "#566873" }}>Control</h3>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-10">
                        <div className="p-4 bg-white border rounded-4 shadow-sm">
                            
                            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-4 gap-2">
                                <h5 className="fw-bold m-0" style={{ color: "#566873" }}>Análisis de Distribución</h5>

                                <select
                                    className="form-select form-select-sm border-0 bg-light fw-bold"
                                    style={{ borderRadius: "10px", color: "#566873", width: "auto", minWidth: "180px" }}
                                    value={filtroTarta}
                                    onChange={(e) => setFiltroTarta(e.target.value)}
                                >
                                    <option value="motivo">Por Motivo de Consulta</option>
                                    <option value="alertas">Por Alertas de Salud</option>
                                    <option value="genero">Por Género</option>
                                </select>
                            </div>

                            {/* GRÁFICA */}
                            <div style={{ height: "300px" }}>
                                <Pie
                                    key={filtroTarta}
                                    data={dataTarta}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                                labels: { usePointStyle: true, padding: 20, font: { size: 12 } }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}