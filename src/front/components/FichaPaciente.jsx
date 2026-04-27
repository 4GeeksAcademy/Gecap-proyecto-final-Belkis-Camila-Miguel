import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import Cloudinary from "./Cloudinary";

export const FichaPaciente = () => {
    const { store, dispatch } = useGlobalReducer();
    const p = store.pacienteActual;
    const navigate = useNavigate();
    const [fotoPaciente, setFotoPaciente] = useState(
        localStorage.getItem(`fotoPaciente_${p?.id}`) || ""
    );

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

    const handleEliminarDesdeFicha = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar permanentemente este paciente?")) return;

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pacientes/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });

        if (response.ok) {
            dispatch({ type: "delete_patient", payload: id });
            navigate("/pacientes");
        }
    };

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">
           
            <button
                className="btn shadow-sm d-flex align-items-center gap-2 px-4"
                style={{
                    backgroundColor: "#566873",
                    color: "white",
                    borderRadius: "12px",
                    border: "none",
                    height: "45px"
                }}
                onClick={() => navigate("/pacientes")}
            >
                <i className="fas fa-search"></i>
                <span className="fw-bold">Nueva Búsqueda</span>
            </button>

            <div className="sticky-top pt-2" style={{ zIndex: 1050, top: '10px', pointerEvents: 'none' }}>
                <div className="d-flex flex-wrap gap-3 justify-content-center">
                    {alertasCriticas.map((alerta, index) => (
                        <div key={index} className="alert d-flex align-items-center border-0 shadow-lg m-0 text-white mi-alerta-viva" title={alerta.prot}
                            style={{ backgroundColor: alerta.color, borderRadius: "14px", cursor: "help", pointerEvents: 'auto', padding: '12px 20px', minWidth: '280px', flex: '0 1 auto', borderBottom: '4px solid rgba(0,0,0,0.2)' }}>
                            <i className={`fas ${alerta.icon} me-3 fa-lg`}></i>
                            <div style={{ lineHeight: '1.2' }}>
                                <small className="d-block opacity-75" style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>AVISO MÉDICO</small>
                                <strong className="text-uppercase" style={{ fontSize: '0.9rem' }}>{alerta.msg}</strong>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. CABECERA DE IDENTIDAD */}
            <div className="d-flex justify-content-between align-items-center mb-4 p-4 rounded-4 shadow-sm bg-white border-start border-5 mt-3" style={{ borderColor: "#e8888c" }}>
                <div className="d-flex flex-column align-items-center">
                    <Cloudinary
                        imageUrl={fotoPaciente}
                        onImageUpload={(url) => {
                            setFotoPaciente(url);
                            localStorage.setItem(`fotoPaciente_${p.id}`, url);
                        }}
                    />
                </div>
                <div>
                    <h2 className="mb-0 fw-bold" style={{ color: "#566873" }}>
                        {p.nombre} {p.apellidos}
                        {p.embarazo === "SI" && <i className="fas fa-baby ms-3 text-danger animate__animated animate__flash animate__infinite" title="EMBARAZADA"></i>}
                    </h2>
                    <div className="d-flex gap-2 mt-2">
                        <span className="badge px-3 py-2" style={{ backgroundColor: "#93bbbf" }}>Paciente Activo</span>
                        {saludable && <span className="badge bg-success px-3 py-2"><i className="fas fa-medal me-1"></i> Peso Saludable</span>}
                    </div>
                </div>
                
                <div className="text-end">
                    <p className="mb-0 text-muted small uppercase fw-bold">Última actualización</p>
                    <p className="fw-bold h5" style={{ color: "#566873" }}>{new Date().toLocaleDateString()}</p>
                </div>
            </div>

            {/* 3. WIDGETS DE CONSTANTES */}
            <div className="row g-3 mb-3 text-center">
                <div className="col-md-4">
                    <div className="p-3 rounded-4 bg-white shadow-sm border-bottom border-4" style={{ borderColor: "#93bbbf" }}>
                        <p className="small text-muted mb-0">Peso Actual</p>
                        <h5 className="fw-bold mb-0">{p.peso || "--"} kg</h5>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-3 rounded-4 bg-white shadow-sm border-bottom border-4" style={{ borderColor: saludable ? "#28a745" : "#ffc107" }}>
                        <p className="small text-muted mb-0">Objetivo Saludable</p>
                        <h5 className="fw-bold mb-0">{p.imc_ideal || "--"}</h5>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-3 rounded-4 bg-white shadow-sm border-bottom border-4" style={{ borderColor: "#566873" }}>
                        <p className="small text-muted mb-0">Edad</p>
                        <h5 className="fw-bold mb-0">{p.edad || "--"} años</h5>
                    </div>
                </div>
            </div>

            <div className="row g-3 mb-4 text-center">
                <div className="col-md-4">
                    <div className={`p-3 rounded-4 bg-white shadow-sm border-bottom border-4 ${parseInt(p.tension) > 140 ? 'border-danger' : 'border-info'}`}>
                        <p className="small text-muted mb-0">Tensión Arterial</p>
                        <h5 className="fw-bold mb-0">{p.tension || "--"}</h5>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className={`p-3 rounded-4 bg-white shadow-sm border-bottom border-4 ${parseFloat(p.glucosa) > 180 ? 'border-danger mi-alerta-viva' : 'border-success'}`}>
                        <p className="small text-muted mb-0">Glucosa</p>
                        <h5 className="fw-bold mb-0">{p.glucosa || "--"} mg/dL</h5>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className={`p-3 rounded-4 bg-white shadow-sm border-bottom border-4 ${p.spo2 < 94 && p.spo2 > 0 ? 'border-warning' : 'border-primary'}`}>
                        <p className="small text-muted mb-0">Saturación O2</p>
                        <h5 className="fw-bold mb-0">{p.spo2 || "--"}%</h5>
                    </div>
                </div>
            </div>

            {/* 4. INFORMACIÓN DETALLADA */}
            <div className="row">
                {/* Lateral: Datos Personales */}
                <div className="col-lg-4 mb-4">
                    <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden">
                        <div className="card-header py-3 text-white border-0" style={{ backgroundColor: "#566873" }}>
                            <i className="fas fa-id-card me-2"></i> Datos Personales
                        </div>
                        <div className="card-body bg-white">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item px-0 py-2 border-bottom">
                                    <span className="text-muted small d-block">DNI / NIE</span>
                                    <span className="fw-bold">{p.dni}</span>
                                </li>
                                <li className="list-group-item px-0 py-3 border-bottom"><span className="text-muted small d-block">Email</span><span className="fw-bold">{p.email}</span></li>
                                <li className="list-group-item px-0 py-3 border-bottom"><span className="text-muted small d-block">Teléfono</span><span className="fw-bold" style={{ color: "#e8888c" }}>{p.telefono}</span></li>
                                <li className="list-group-item px-0 py-3 border-0"><span className="text-muted small d-block">Dirección</span><span className="small fw-semibold">{p.direccion}, {p.ciudad}</span></li>
                                <li className="list-group-item px-0 py-2 border-bottom">
                                    <span className="text-muted small d-block">Fecha de Nacimiento</span>
                                    <span className="fw-bold">{p.nacimiento || "No registrada"}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Principal: Historial y Tratamiento */}
                <div className="col-lg-8">
                    <div className="row g-3">
                        <div className="col-md-6 mb-3">
                            <div className="card border-0 shadow-sm h-100 rounded-4" style={{ backgroundColor: alertasCriticas.length > 0 ? "#fff5f5" : "#ebf2f1", borderLeft: alertasCriticas.length > 0 ? "5px solid #dc3545" : "none" }}>
                                <div className="card-body">
                                    <h6 className="fw-bold mb-3" style={{ color: "#e8888c" }}><i className="fas fa-biohazard me-2"></i> Riesgos y Alergias</h6>
                                    <div className="d-flex flex-wrap gap-1">
                                        {alertasCriticas.length > 0 ? alertasCriticas.map((a, i) => (
                                            <span key={i} className="badge text-white p-2" style={{ backgroundColor: a.color, fontSize: '0.7rem' }} title={a.prot}><i className={`fas ${a.icon} me-1`}></i> {a.msg}</span>
                                        )) : <span className="text-muted fw-bold">Ninguna conocida</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 mb-3">
                            <div className="card border-0 shadow-sm h-100 rounded-4" style={{ backgroundColor: "#b4d2d9" }}>
                                <div className="card-body text-center d-flex flex-column justify-content-center">
                                    <h6 className="fw-bold mb-1" style={{ color: "#566873" }}>Grupo Sanguíneo</h6>
                                    <h2 className="mb-0 fw-black display-5" style={{ color: "#566873" }}>{p.grupoSanguineo || "--"}</h2>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 mb-3">
                            <div className="card border-0 shadow-sm rounded-4">
                                <div className="card-header py-3 text-white border-0" style={{ backgroundColor: "#93bbbf" }}>
                                    <h6 className="mb-0 fw-bold"><i className="fas fa-history me-2"></i> ANTECEDENTES MÉDICOS</h6>
                                </div>
                                <div className="card-body bg-white p-4">
                                    <div className="p-3 rounded-3 bg-light" style={{ minHeight: "100px", borderLeft: "4px solid #93bbbf" }}>
                                        <p className="text-secondary mb-0" style={{ lineHeight: "1.6", whiteSpace: "pre-line" }}>{p.antecedentes || "Sin antecedentes registrados."}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 mb-3">
                            <div className="card border-0 shadow-sm rounded-4 overflow-hidden border-start border-5" style={{ borderColor: "#5e888c" }}>
                                <div className="card-header py-3 text-white border-0 d-flex justify-content-between align-items-center" style={{ backgroundColor: "#5e888c" }}>
                                    <h6 className="mb-0 fw-bold"><i className="fas fa-prescription me-2"></i> PLAN DE TRATAMIENTO</h6>
                                    <button className="btn btn-sm btn-light text-dark fw-bold rounded-pill px-3 d-print-none" onClick={() => alert("✅ Guardado")}>Confirmar y Guardar</button>
                                </div>
                                <div className="card-body bg-white p-4">
                                    <textarea className="form-control border-0 bg-light p-3 fw-bold" style={{ color: "#566873", fontSize: "1.1rem", minHeight: "120px" }} defaultValue={p.tratamiento || ""} placeholder="Escriba la receta aquí..." />
                                </div>
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                                <div className="card-header py-3 text-white border-0" style={{ backgroundColor: "#566873" }}>
                                    <h6 className="mb-0 fw-bold"><i className="fas fa-notes-medical me-2"></i> NOTAS DE EVOLUCIÓN</h6>
                                </div>
                                <div className="card-body bg-white p-4">
                                    <p className="text-secondary mb-4">{p.anotaciones || "No hay notas registradas."}</p>
                                    <hr />
                                    <div className="d-flex flex-wrap gap-3 justify-content-end d-print-none">
                                        <button
                                            className="btn px-4 btn-outline-secondary"
                                            style={{ borderRadius: "10px" }}
                                            onClick={() => navigate("/healthform")}
                                        >
                                            Editar Ficha
                                        </button>
                                        <button className="btn px-4 text-white" style={{ backgroundColor: "#e8888c", borderRadius: "10px" }} onClick={() => navigate("/areapersonal", { state: { pacienteId: p.id, nombre: p.nombre } })}>Nueva Consulta</button>
                                        <button className="btn px-4 text-white" style={{ backgroundColor: "#566873", borderRadius: "10px" }} onClick={() => window.print()}>Generar Informe</button>
                                        <button
                                            className="btn btn-outline-danger rounded-pill px-3 shadow-sm"
                                            onClick={() => handleEliminarDesdeFicha(p.id)}
                                        >
                                            <i className="fas fa-trash-alt me-2"></i>Eliminar Paciente
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="d-none d-print-block w-100">
                                <div style={{ height: "100px" }}></div>

                                <div className="d-flex justify-content-end">
                                    <div className="text-center" style={{ width: "300px" }}>
                                        <div style={{ borderTop: "2px solid #000", marginBottom: "8px" }}></div>
                                        <p className="fw-bold mb-0">Firma y Sello del Facultativo</p>
                                        <p className="small text-muted mb-0">Nº Colegiado: ________________</p>
                                        <p className="small">Fecha: {new Date().toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};