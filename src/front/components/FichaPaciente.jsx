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
        if (p.embarazo === "SI") {
            alertas.push({
                msg: "ALERTA: PACIENTE EMBARAZADA",
                color: "#dc3545",
                icon: "fa-baby",
                prot: "¡CRÍTICO! Prohibido radiografías sin protección/justificación. Revisar compatibilidad de fármacos."
            });
        }

        // Glucosa
        const glucosaVal = parseFloat(p.glucosa);
        if (glucosaVal > 180) {
            alertas.push({
                msg: `GLUCOSA ALTA: ${glucosaVal} mg/dL`,
                color: "#fd7e14",
                icon: "fa-droplet",
                prot: "Riesgo de infección y retraso en cicatrización. Valorar profilaxis antibiótica."
            });
        }

        // Saturación de Oxígeno
        const oxygen = parseFloat(p.spo2);
        if (oxygen > 0 && oxygen < 94) {
            alertas.push({
                msg: `SpO2 BAJA: ${oxygen}%`,
                color: "#ffc107",
                icon: "fa-lungs",
                prot: "Saturación de oxígeno por debajo del nivel óptimo. Precaución en procedimientos largos."
            });
        }
        const alergiasMap = [
            { key: "alergia_penicilina", msg: "ALERGIA: PENICILINA", prot: "Riesgo de shock. No administrar derivados." },
            { key: "alergia_terramicina", msg: "ALERGIA: TERRAMICINA", prot: "Evitar tetraciclinas." },
            { key: "alergia_anestesia", msg: "ALERGIA: ANESTESIA", prot: "Usar alternativa sin vasoconstrictor." },
            { key: "alergia_latex", msg: "ALERGIA: LÁTEX", prot: "Protocolo libre de látex." },
            { key: "alergia_aines", msg: "ALERGIA: AINEs / ASPIRINA", prot: "Evitar antiinflamatorios no esteroideos." }
        ];

        alergiasMap.forEach(a => {
            if (p[a.key] === "SI") alertas.push({ msg: a.msg, color: "#e8888c", icon: "fa-skull-crossbones", prot: a.prot });
        });

        // Riesgos Médicos y Bioseguridad
        const riesgosMap = [
            { key: "hepatitis", msg: "RIESGO: HEPATITIS", icon: "fa-virus", color: "#6f42c1", prot: "Protocolo biológico. Esterilización nivel 3." },
            { key: "tuberculosis", msg: "RIESGO: TUBERCULOSIS", icon: "fa-lungs", color: "#6f42c1", prot: "Transmisión aérea. Mascarilla FFP3." },
            { key: "vih", msg: "RIESGO: VIH+", icon: "fa-biohazard", color: "#6f42c1", prot: "Inmunodepresión. Cuidado infecciones post-op." },
            { key: "osteoporosis", msg: "ALERTA: BIFOSFONATOS", icon: "fa-bone", color: "#fd7e14", prot: "¡PELIGRO! Riesgo osteonecrosis en cirugía." },
            { key: "radiacion_cabeza", msg: "ALERTA: RADIOTERAPIA", icon: "fa-radiation", color: "#fd7e14", prot: "Fragilidad ósea y xerostomía detectada." }
        ];

        riesgosMap.forEach(r => {
            if (p[r.key] === "SI") alertas.push({ msg: r.msg, color: r.color, icon: r.icon, prot: r.prot });
        });

        if (p.alergia_otros) alertas.push({ msg: `OTRAS: ${p.alergia_otros}`, color: "#e8888c", icon: "fa-exclamation-triangle", prot: "Verificar historial" });

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

            <div className="sticky-top pt-2" style={{ zIndex: 1050, top: '10px', pointerEvents: 'none' }}>
                <div className="d-flex flex-wrap gap-3 justify-content-center">
                    {alertasCriticas.map((alerta, index) => (
                        <div
                            key={index}
                            className="alert d-flex align-items-center border-0 shadow-lg m-0 text-white mi-alerta-viva"
                            title={alerta.prot}
                            style={{
                                backgroundColor: alerta.color,
                                borderRadius: "14px",
                                cursor: "help",
                                pointerEvents: 'auto',
                                padding: '12px 20px',      // Un poco más de aire interno
                                minWidth: '280px',         // Tamaño más robusto
                                flex: '0 1 auto',          // Crece según el contenido
                                borderBottom: '4px solid rgba(0,0,0,0.2)' // Efecto de relieve
                            }}
                        >
                            <i className={`fas ${alerta.icon} me-3 fa-lg`}></i>
                            <div style={{ lineHeight: '1.2' }}>
                                <small className="d-block opacity-75" style={{ fontSize: '0.65rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>AVISO MÉDICO</small>
                                <strong className="text-uppercase" style={{ fontSize: '0.9rem' }}>{alerta.msg}</strong>
                            </div>
                            <i className="fas fa-info-circle ms-auto ps-3 opacity-50"></i>
                        </div>
                    ))}
                </div>
            </div>

            {/* CABECERA DE IDENTIDAD CON DATOS REALES */}
            <div className="d-flex justify-content-between align-items-center mb-4 p-4 rounded-4 shadow-sm bg-white border-start border-5" style={{ borderColor: "#e8888c" }}>
                <div>
                    <h2 className="mb-0 fw-bold" style={{ color: "#566873" }}>
                        {p.nombre} {p.apellidos}
                        {p.embarazo === "SI" && (
                            <i
                                className="fas fa-baby ms-3 text-danger animate__animated animate__flash animate__infinite"
                                title="¡ATENCIÓN! PACIENTE EMBARAZADA"
                                style={{ filter: "drop-shadow(0 0 5px rgba(220, 53, 69, 0.4))" }}
                            ></i>
                        )}
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
            <div className="row g-3 mb-3 text-center">
                <div className="col-md-4">
                    <div className="p-3 rounded-4 bg-white shadow-sm border-bottom border-4" style={{ borderColor: "#93bbbf" }}>
                        <p className="small text-muted mb-0">Peso Actual</p>
                        <h5 className="fw-bold mb-0">{p.peso || "--"} kg</h5>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-3 rounded-4 bg-white shadow-sm border-bottom border-4"
                        style={{ borderColor: saludable ? "#28a745" : "#ffc107" }}>
                        <p className="small text-muted mb-0">Objetivo Saludable (IMC)</p>
                        <h5 className="fw-bold mb-0">{p.imc_ideal || "--"}</h5>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-3 rounded-4 bg-white shadow-sm border-bottom border-4" style={{ borderColor: "#566873" }}>
                        <p className="small text-muted mb-0">Edad / Año Nac.</p>
                        <h5 className="fw-bold mb-0">{p.edad || "--"} años <small className="text-muted" style={{ fontSize: '0.7rem' }}>({p.nacimiento})</small></h5>
                    </div>
                </div>
            </div>

            {/* WIDGETS DE CONSTANTES (Signos Vitales Críticos) */}
            <div className="row g-3 mb-4 text-center">
                <div className="col-md-4">
                    <div className={`p-3 rounded-4 bg-white shadow-sm border-bottom border-4 ${parseInt(p.tension) > 140 ? 'border-danger' : 'border-info'}`}>
                        <p className="small text-muted mb-0">Tensión Arterial</p>
                        <h5 className={`fw-bold mb-0 ${parseInt(p.tension) > 140 ? 'text-danger' : ''}`}>{p.tension || "--"}</h5>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className={`p-3 rounded-4 bg-white shadow-sm border-bottom border-4 ${parseFloat(p.glucosa) > 180 ? 'border-danger mi-alerta-viva' : 'border-success'}`}>
                        <p className="small text-muted mb-0">Glucosa Capilar</p>
                        <h5 className={`fw-bold mb-0 ${parseFloat(p.glucosa) > 180 ? 'text-danger' : ''}`}>{p.glucosa || "--"} <small style={{ fontSize: '0.7rem' }}>mg/dL</small></h5>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className={`p-3 rounded-4 bg-white shadow-sm border-bottom border-4 ${p.spo2 < 94 && p.spo2 > 0 ? 'border-warning' : 'border-primary'}`}>
                        <p className="small text-muted mb-0">Saturación Oxígeno</p>
                        <h5 className="fw-bold mb-0">{p.spo2 || "--"}% SpO2</h5>
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
                                style={{
                                    backgroundColor: alertasCriticas.length > 0 ? "#fff5f5" : "#ebf2f1",
                                    borderLeft: alertasCriticas.length > 0 ? "5px solid #dc3545" : "none"
                                }}>
                                <div className="card-body">
                                    <h6 className="fw-bold mb-3" style={{ color: "#e8888c" }}>
                                        <i className="fas fa-biohazard me-2"></i> Riesgos y Alergias
                                    </h6>
                                    <div className="d-flex flex-wrap gap-1">
                                        {alertasCriticas.length > 0 ? (
                                            alertasCriticas.map((a, i) => (
                                                <span
                                                    key={i}
                                                    className="badge text-white p-2 mi-alerta-viva"
                                                    style={{ backgroundColor: a.color, fontSize: '0.7rem', cursor: 'help' }}
                                                    title={a.prot}
                                                >
                                                    <i className={`fas ${a.icon} me-1`}></i> {a.msg}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-muted fw-bold">Ninguna conocida</span>
                                        )}
                                    </div>
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