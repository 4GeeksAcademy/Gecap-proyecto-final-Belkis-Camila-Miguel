import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { BuscadorPacientes } from "./BuscadorPacientes";

export const FichaPaciente = () => {
    const { store } = useGlobalReducer();
    const p = store.pacienteActual;

    if (!p) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center text-center">
                    <div className="col-md-6">
                        <div className="card border-0 shadow-sm p-5 rounded-4 bg-white">
                            <i className="fas fa-user-injured fa-3x mb-3 text-muted"></i>
                            <h4 className="fw-bold text-secondary">Consulta de Pacientes</h4>
                            <p className="text-muted mb-4">Busca un paciente por nombre o DNI para ver su ficha clínica</p>

                            <div className="d-flex justify-content-center">
                                <BuscadorPacientes />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const detectarAlertas = () => {
        let alertas = [];
        if (p.alergia_penicilina === "SI") alertas.push({ msg: "ALÉRGICO: PENICILINA", color: "#e8888c", icon: "fa-skull-crossbones" });
        if (p.alergia_terramicina === "SI") alertas.push({ msg: "ALÉRGICO: TERRAMICINA", color: "#e8888c", icon: "fa-capsules" });
        if (p.alergia_anestesia === "SI") alertas.push({ msg: "ALÉRGICO: ANESTESIA", color: "#e8888c", icon: "fa-syringe" });
        if (p.alergia_latex === "SI") alertas.push({ msg: "ALÉRGICO: LÁTEX", color: "#e8888c", icon: "fa-hand-dots" });
        if (p.alergia_aines === "SI") alertas.push({ msg: "ALÉRGICO: AINEs / ASPIRINA", color: "#e8888c", icon: "fa-pills" });

        if (p.alergia_otros) {
            alertas.push({ msg: `OTRAS ALERGIAS: ${p.alergia_otros}`, color: "#e8888c", icon: "fa-exclamation-triangle" });
        }
        return alertas;
    };

    const alertasCriticas = detectarAlertas();

    const esPesoSaludable = () => {
        if (!p.peso || !p.imc_ideal || p.imc_ideal === "--") return false;

        const [min, max] = p.imc_ideal.replace(" kg", "").split(" - ").map(Number);
        const pesoActual = Number(p.peso);

        return pesoActual >= min && pesoActual <= max;
    };

    const saludable = esPesoSaludable();

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">
            <div className="mb-3">
                <button
                    className="btn btn-sm btn-outline-secondary rounded-pill"
                    onClick={() => dispatch({ type: 'clear_patient' })}
                >
                    <i className="fas fa-chevron-left me-2"></i>Nueva Búsqueda
                </button>
            </div>

            {/* ALERTAS DINÁMICAS */}
            {alertasCriticas.map((alerta, index) => (
                <div key={index} className="alert d-flex align-items-center border-0 shadow-sm mb-3 text-white animate__animated animate__pulse animate__infinite"
                    style={{ backgroundColor: alerta.color, borderRadius: "12px" }}>
                    <i className={`fas ${alerta.icon} me-3 fa-lg`}></i>
                    <strong className="text-uppercase">{alerta.msg}</strong>
                </div>
            ))}

            {/* CABECERA DE IDENTIDAD CON DATOS REALES */}
            <div className="d-flex justify-content-between align-items-center mb-4 p-4 rounded-4 shadow-sm bg-white border-start border-5" style={{ borderColor: "#e8888c" }}>
                <div>
                    <h2 className="mb-0 fw-bold" style={{ color: "#566873" }}>
                        {p.nombre} {p.apellidos}
                    </h2>
                    <div className="d-flex gap-2 mt-2">
                        <span className="badge px-3 py-2" style={{ backgroundColor: "#93bbbf" }}>Paciente Activo</span>
                        {saludable && (
                            <span className="badge bg-success px-3 py-2 animate__animated animate__bounceIn">
                                <i className="fas fa-medal me-1"></i> Peso Saludable
                            </span>
                        )}
                        {alertasCriticas.length > 0 && <span className="badge bg-danger px-3 py-2 uppercase">Riesgo Alérgico</span>}
                    </div>
                </div>
                <div className="text-end">
                    <p className="mb-0 text-muted small uppercase fw-bold">Última actualización</p>
                    <p className="fw-bold h5" style={{ color: "#566873" }}>{new Date().toLocaleDateString()}</p>
                </div>
            </div>

            {/* WIDGETS DE CONSTANTES CON DATOS REALES */}
            <div className="row g-3 mb-4">
                {/* CAJA 1: Peso Real */}
                <div className="col-md-3">
                    <div className="p-3 rounded-4 bg-white shadow-sm border-bottom border-4" style={{ borderColor: "#93bbbf" }}>
                        <p className="small text-muted mb-0">Peso Actual</p>
                        <h5 className="fw-bold mb-0">{p.peso || "--"} kg</h5>
                    </div>
                </div>

                {/* CAJA 2: Tensión */}
                <div className="col-md-3">
                    <div className="p-3 rounded-4 bg-white shadow-sm border-bottom border-4" style={{ borderColor: "#b4d2d9" }}>
                        <p className="small text-muted mb-0">Última Tensión</p>
                        <h5 className="fw-bold mb-0">{p.tension || "--"}</h5>
                    </div>
                </div>

                {/* CAJA 3: Edad */}
                <div className="col-md-3">
                    <div className="p-3 rounded-4 bg-white shadow-sm border-bottom border-4" style={{ borderColor: "#ebf2f1" }}>
                        <p className="small text-muted mb-0">Edad</p>
                        <h5 className="fw-bold mb-0">{p.edad || "--"} años</h5>
                    </div>
                </div>

                {/* CAJA 4: EL OBJETIVO */}
                <div className="col-md-3">
                    <div className="p-3 rounded-4 bg-white shadow-sm border-bottom border-4"
                        style={{ borderColor: saludable ? "#28a745" : "#ffc107" }}>
                        <p className="small text-muted mb-0">Objetivo Saludable</p>
                        <h5 className="fw-bold mb-0">{p.imc_ideal || "--"}</h5>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-4 mb-4">
                    <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden">
                        <div className="card-header py-3 text-white border-0" style={{ backgroundColor: "#566873" }}>
                            <i className="fas fa-id-card me-2"></i> Datos Personales
                        </div>
                        <div className="card-body bg-white text-dark">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-3 border-bottom">
                                    <span className="text-muted">DNI / Identificación:</span>
                                    <span className="fw-bold text-dark">{p?.dni || "--"}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-3 border-bottom">
                                    <span className="text-muted">Email:</span>
                                    <span className="fw-bold">{p.email}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-3 border-bottom">
                                    <span className="text-muted">Nacimiento:</span>
                                    <span>{p.nacimiento}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-3 border-bottom">
                                    <span className="text-muted">Teléfono:</span>
                                    <span style={{ color: "#e8888c", fontWeight: "bold" }}>{p.telefono}</span>
                                </li>
                                <li className="list-group-item border-0 px-0 py-3">
                                    <span className="text-muted d-block mb-1">Dirección:</span>
                                    <span className="small text-dark fw-semibold">{p.direccion}, {p.ciudad}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Información Médica Crítica */}
                <div className="col-lg-8">
                    <div className="row">
                        {/* Alergias y Alertas con estilo dinámico */}
                        <div className="col-md-6 mb-4">
                            <div className="card border-0 shadow-sm h-100 rounded-4"
                                style={{ backgroundColor: alertasCriticas.length > 0 ? "#fff5f5" : "#ebf2f1", borderLeft: alertasCriticas.length > 0 ? "5px solid #e8888c" : "none" }}>
                                <div className="card-body">
                                    <h6 className="fw-bold mb-3" style={{ color: "#e8888c" }}>
                                        <i className="fas fa-exclamation-triangle me-2"></i> Alergias Conocidas
                                    </h6>
                                    <p className={`mb-0 fw-bold ${alertasCriticas.length > 0 ? 'text-danger' : ''}`} style={{ fontSize: "1.1rem" }}>
                                        {/* Listamos las alergias activas del Store */}
                                        {[
                                            p.alergia_penicilina === "SI" ? "Penicilina" : null,
                                            p.alergia_terramicina === "SI" ? "Terramicina" : null,
                                            p.alergia_anestesia === "SI" ? "Anestesia" : null,
                                            p.alergia_otros
                                        ].filter(Boolean).join(", ") || "Ninguna conocida"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Grupo Sanguíneo */}
                        <div className="col-md-6 mb-4">
                            <div className="card border-0 shadow-sm h-100 rounded-4" style={{ backgroundColor: "#b4d2d9" }}>
                                <div className="card-body text-center d-flex flex-column justify-content-center">
                                    <h6 className="fw-bold mb-1" style={{ color: "#566873" }}>Grupo Sanguíneo</h6>
                                    <h2 className="mb-0 fw-black display-5" style={{ color: "#566873" }}>{p.grupoSanguineo || "--"}</h2>
                                </div>
                            </div>
                        </div>

                        {/* Historial y Acciones */}
                        <div className="col-12">
                            <div className="card border-0 shadow-sm rounded-4">
                                <div className="card-header py-3 text-white border-0" style={{ backgroundColor: "#93bbbf" }}>
                                    <i className="fas fa-history me-2"></i> Observaciones Médicas y Antecedentes
                                </div>
                                <div className="card-body bg-white p-4">
                                    <p className="card-text text-secondary" style={{ lineHeight: "1.6" }}>
                                        {p.antecedentes || "Sin antecedentes registrados."}
                                    </p>
                                    <hr className="my-4" />
                                    <div className="d-flex flex-wrap gap-3">
                                        <button className="btn px-4 text-white shadow-sm" style={{ backgroundColor: "#e8888c", borderRadius: "10px" }}>Nueva Consulta</button>
                                        <button className="btn px-4 btn-outline-secondary" style={{ borderRadius: "10px" }}>Editar Ficha</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Historial de Evolución (Notas del Alta) */}
                        <div className="card border-0 shadow-sm mt-4 rounded-4 overflow-hidden">
                            <div className="card-header py-3 text-white border-0 d-flex justify-content-between align-items-center" style={{ backgroundColor: "#566873" }}>
                                <h6 className="mb-0 fw-bold"><i className="fas fa-notes-medical me-2"></i> Notas de Ingreso / Evolución</h6>
                            </div>
                            <div className="card-body bg-white p-4">
                                <p className="text-secondary" style={{ whiteSpace: "pre-line" }}>
                                    {p.anotaciones || "No hay notas registradas para este paciente."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};