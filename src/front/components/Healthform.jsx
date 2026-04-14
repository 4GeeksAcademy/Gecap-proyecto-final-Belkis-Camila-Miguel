import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

// --- COMPONENTES AUXILIARES ---
const InputFloatingFlex = ({ label, name, type = "text", icon, onChange, accentColor, colSize = "col-md-4", value, required = false }) => (
  <div className={`${colSize} mb-2`}>
    <div className="form-floating shadow-sm">
      <input
        type={type}
        name={name}
        className="form-control border-0 bg-light text-dark"
        placeholder={label}
        onChange={onChange}
        value={value || ""}
        required={required}
        style={{ fontSize: '0.9rem' }}
      />
      <label className="text-muted small">
        <i className={`${icon} me-2`} style={{ color: accentColor }}></i>
        {label} {required && <span className="text-danger">*</span>}
      </label>
    </div>
  </div>
);

const CompactQuestion = ({ q, name, hasText, onChange, accentColor }) => (
  <div className="py-2 border-bottom border-light">
    <div className="d-flex align-items-center justify-content-between">
      <span className="small fw-semibold text-secondary">{q}</span>
      <div className="btn-group btn-group-sm ms-3 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden' }}>
        <input type="radio" className="btn-check" name={name} id={`${name}-si`} value="SI" onChange={onChange} />
        <label className="btn btn-outline-success border-0 px-3" htmlFor={`${name}-si`}>SÍ</label>
        <input type="radio" className="btn-check" name={name} id={`${name}-no`} value="NO" onChange={onChange} />
        <label className="btn btn-outline-secondary border-0 px-3" htmlFor={`${name}-no`}>NO</label>
      </div>
    </div>
    {hasText && (
      <input
        type="text"
        name={`${name}_detalle`}
        className="form-control form-control-sm border-0 bg-light mt-1 w-75 text-dark"
        placeholder="Detalles..."
        onChange={onChange}
        style={{ fontSize: '0.75rem', height: '25px' }}
      />
    )}
  </div>
);

// --- COMPONENTE PRINCIPAL ---
export default function Healthform() {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "", apellidos: "", dni: "", email: "", telefono: "", nacimiento: "", edad: "--",
    direccion: "", ciudad: "", pais: "", cp: "",
    peso: "", altura: "", tension: "", frecuencia: "",
    salud: "NO", hipertension: "NO", corazon: "NO", medicamento: "NO",
    diabetes: "NO", rinones: "NO", higado: "NO", pulmon: "NO",
    cancer: "NO", radiacion: "NO", habitos: "NO",

    // CAMPOS ESPECÍFICOS DE ALERGIAS
    alergia: "NO",
    alergia_penicilina: "NO",
    alergia_terramicina: "NO",
    alergia_anestesia: "NO",
    alergia_latex: "NO",
    alergia_aines: "NO",
    alergia_otros: "",

    anestesia: "NO", cirugias: "NO", depresion: "NO", drogas: "NO",
    observaciones: "", antecedentes: "", anotaciones: ""
  });

  const handleGuardar = () => {
    const { dni, nombre, apellidos, email, telefono } = formData;

    // Validación de campos obligatorios
    if (!nombre || !apellidos || !dni || !email || !telefono) {
      alert("Por favor, rellena los campos obligatorios marcados con *");
      return;
    }

    const dniRegex = /^\d{8}[a-zA-Z]$/;
    if (!dniRegex.test(dni)) {
      alert("El formato del DNI no es válido (ej: 12345678X).");
      return;
    }

    // Validación de Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("El formato del correo electrónico no es válido.");
      return;
    }

    // Validación de Teléfono (mínimo 9 dígitos)
    if (telefono.length < 9) {
      alert("El número de teléfono debe tener al menos 9 dígitos.");
      return;
    }

    const datosAFicha = {
      ...formData,
      imc_ideal: infoIMC.ideal
    };

    // Si todo está ok, guardamos
    dispatch({ type: 'save_patient', payload: formData });
    alert("¡Paciente registrado con éxito!");
    navigate("/paciente");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prevData => {
      const nuevosDatos = { ...prevData, [name]: value };

      // Lógica de cálculo de edad
      if (name === "nacimiento") {
        const anioActual = new Date().getFullYear();
        nuevosDatos.edad = value && value > 1900 ? anioActual - parseInt(value) : "--";
      }

      return nuevosDatos;
    });
  };

  const getInfoIMC = () => {
    const { peso, altura } = formData;
    if (peso && altura && altura > 0) {
      const alturaMetros = altura / 100;
      const imc = (peso / Math.pow(alturaMetros, 2)).toFixed(1);

      // CÁLCULO DE REFERENCIA (IMC Normal: 18.5 a 24.9)
      const pesoMin = (18.5 * Math.pow(alturaMetros, 2)).toFixed(1);
      const pesoMax = (24.9 * Math.pow(alturaMetros, 2)).toFixed(1);
      const rangoNormal = `${pesoMin} - ${pesoMax} kg`;

      if (imc < 18.5) return { valor: imc, label: "Bajo Peso", color: "#17a2b8", ideal: rangoNormal };
      if (imc < 25) return { valor: imc, label: "Normal", color: "#28a745", ideal: rangoNormal };
      if (imc < 30) return { valor: imc, label: "Sobrepeso", color: "#ffc107", ideal: rangoNormal };
      return { valor: imc, label: "Obesidad", color: "#dc3545", ideal: rangoNormal };
    }
    return { valor: "--", label: "Faltan datos", color: "#6c757d", ideal: "--" };
  };

  const infoIMC = getInfoIMC();

  const alertasActivas = [];

  if (formData.alergia_penicilina === "SI") {
    alertasActivas.push({ msg: "ALERGIA CRÍTICA: PENICILINA", color: "danger", icon: "fa-pills" });
  }
  if (formData.alergia_terramicina === "SI") {
    alertasActivas.push({ msg: "ALERGIA CRÍTICA: TERRAMICINA", color: "danger", icon: "fa-capsules" });
  }
  if (formData.alergia_anestesia === "SI") {
    alertasActivas.push({ msg: "ALERGIA CRÍTICA: ANESTESIA LOCAL", color: "danger", icon: "fa-syringe" });
  }
  if (formData.alergia_otros) {
    alertasActivas.push({ msg: `OTRAS ALERGIAS: ${formData.alergia_otros}`, color: "warning", icon: "fa-exclamation-circle" });
  }

  if (infoIMC.valor !== "--" && parseFloat(infoIMC.valor) > 35) {
    alertasActivas.push({ msg: `RIESGO: IMC ELEVADO (${infoIMC.valor})`, color: "warning", icon: "fa-weight" });
  }
  const secciones = [
    {
      titulo: "Estado General y Cardiovascular",
      color: "#007bff",
      preguntas: [
        { q: "¿Goza de buena salud?", name: "salud" },
        { q: "¿Sufre de hipertensión arterial?", name: "hipertension" },
        { q: "¿Sufre enfermedad del corazón?", name: "corazon", textarea: true },
        { q: "¿Toma algún medicamento?", name: "medicamento", textarea: true },
      ]
    },
    {
      titulo: "Enfermedades Crónicas",
      color: "#007bff",
      preguntas: [
        { q: "¿Problemas de azúcar (Diabetes)?", name: "diabetes", textarea: true },
        { q: "¿Enfermedad en los riñones?", name: "rinones", textarea: true },
        { q: "¿Enfermedad en el hígado?", name: "higado", textarea: true },
        { q: "¿Enfermedad pulmonar?", name: "pulmon", textarea: true },
      ]
    },
    {
      titulo: "Antecedentes y Hábitos",
      color: "#007bff",
      preguntas: [
        { q: "¿Padece o ha pasado Cáncer?", name: "cancer", textarea: true },
        { q: "¿Ha recibido Radiación?", name: "radiacion", textarea: true },
        { q: "¿Fuma o ingiere alcohol?", name: "habitos" },
      ]
    },
    {
      titulo: "Cirugías y Otros",
      color: "#007bff",
      preguntas: [
        { q: "¿Le han realizado cirugías?", name: "cirugias", textarea: true },
        { q: "¿Sufre o ha sufrido depresión?", name: "depresion" },
        { q: "¿Consume sustancias (drogas)?", name: "drogas", textarea: true },
      ]
    }
  ];

  const resetAlergias = () => {
    if (window.confirm("¿Deseas marcar todas las alergias como 'NO' y limpiar las observaciones?")) {
      setFormData(prev => ({
        ...prev,
        alergia_penicilina: "NO",
        alergia_terramicina: "NO",
        alergia_anestesia: "NO",
        alergia_latex: "NO",
        alergia_aines: "NO",
        alergia_otros: ""
      }));
    }
  };

  return (
    <div className="container-fluid py-5 bg-light min-vh-100 font-sans">
      <div className="mx-auto" style={{ maxWidth: "1200px" }}>

        {/* CABECERA */}
        <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded-4 shadow-sm border-start border-5 border-dark">
          <h4 className="fw-bold mb-0 text-dark">Nueva Ficha Clínica</h4>
          <button
            className="btn btn-lg text-white px-5 shadow"
            style={{ backgroundColor: "#e8888c", borderRadius: '12px' }}
            onClick={handleGuardar} // <--- Muy importante
          >
            <i className="fas fa-save me-2"></i>Guardar Ficha
          </button>
        </div>

        {/* ALERTAS DIRECTAS */}
        <div className="mb-4">
          {(formData.alergia_penicilina === "SI" ||
            formData.alergia_terramicina === "SI" ||
            formData.alergia_anestesia === "SI" ||
            formData.alergia_latex === "SI" ||
            formData.alergia_aines === "SI" ||
            formData.alergia_otros) && (
              <div className="alert alert-danger border-0 shadow d-flex align-items-center mb-2 animate__animated animate__shakeX">
                <i className="fas fa-biohazard me-3 fa-2xl"></i>
                <div>
                  <div className="fw-bold text-uppercase small" style={{ letterSpacing: '1px' }}>Riesgo Clínico: Alergias Detectadas</div>
                  <div className="fw-bold">
                    {[
                      formData.alergia_penicilina === "SI" ? "PENICILINA" : null,
                      formData.alergia_terramicina === "SI" ? "TERRAMICINA" : null,
                      formData.alergia_anestesia === "SI" ? "ANESTESIA" : null,
                      formData.alergia_latex === "SI" ? "LÁTEX" : null,
                      formData.alergia_aines === "SI" ? "AINEs" : null,
                      formData.alergia_otros ? formData.alergia_otros.toUpperCase() : null
                    ].filter(Boolean).join(" • ")}
                  </div>
                </div>
              </div>
            )}

          {infoIMC.valor !== "--" && parseFloat(infoIMC.valor) > 35 && (
            <div className="alert alert-warning border-0 shadow-sm d-flex align-items-center mb-2">
              <i className="fas fa-weight-hanging me-3 fa-lg"></i>
              <div className="fw-bold text-uppercase small">Alerta Metabólica: IMC elevado ({infoIMC.valor}).</div>
            </div>
          )}
        </div>

        {/* DATOS PERSONALES */}
        <div className="card border-0 shadow-sm mb-4 rounded-4 bg-white p-4 border-top border-4" style={{ borderColor: "#17a2b8" }}>
          <h6 className="fw-bold mb-4" style={{ color: "#17a2b8" }}><i className="fas fa-id-card me-2"></i>DATOS PERSONALES</h6>
          <div className="row g-2">

            {/* FILA 1: Identidad (4+4+4 = 12) */}
            <InputFloatingFlex label="Nombre" name="nombre" value={formData.nombre} icon="fas fa-user" accentColor="#17a2b8" onChange={handleInputChange} colSize="col-md-4" required={true} />
            <InputFloatingFlex label="Apellidos" name="apellidos" value={formData.apellidos} icon="fas fa-users" accentColor="#17a2b8" onChange={handleInputChange} colSize="col-md-4" required={true} />
            <InputFloatingFlex label="DNI / NIE" name="dni" value={formData.dni} icon="fas fa-id-card" accentColor="#17a2b8" onChange={handleInputChange} colSize="col-md-4" required={true} />

            {/* FILA 2: Tiempos y Contacto (2+2+3+5 = 12) */}
            <div className="col-md-2 mb-2">
              <div className="form-floating shadow-sm">
                <input type="text" className="form-control border-0 bg-info-subtle fw-bold text-info" value={formData.edad} readOnly />
                <label className="small text-muted">Edad</label>
              </div>
            </div>
            <div className="col-md-2 mb-2">
              <div className="form-floating shadow-sm">
                <input type="number" name="nacimiento" value={formData.nacimiento} className="form-control border-0 bg-light text-dark" placeholder="Año" onChange={handleInputChange} />
                <label className="small text-muted">Año Nac.</label>
              </div>
            </div>
            <InputFloatingFlex label="Teléfono" name="telefono" type="tel" value={formData.telefono} icon="fas fa-phone" accentColor="#17a2b8" onChange={handleInputChange} colSize="col-md-3" required={true} />
            <InputFloatingFlex label="Email" name="email" type="email" value={formData.email} icon="fas fa-envelope" accentColor="#17a2b8" onChange={handleInputChange} colSize="col-md-5" required={true} />

            {/* FILA 3: Ubicación Principal (12) */}
            <InputFloatingFlex label="Dirección" name="direccion" value={formData.direccion} icon="fas fa-map-marker-alt" accentColor="#17a2b8" onChange={handleInputChange} colSize="col-md-12" />

            {/* FILA 4: Detalles Postales (5+4+3 = 12) */}
            <InputFloatingFlex label="Ciudad" name="ciudad" value={formData.ciudad} icon="fas fa-city" accentColor="#17a2b8" onChange={handleInputChange} colSize="col-md-5" />
            <InputFloatingFlex label="País" name="pais" value={formData.pais} icon="fas fa-globe-americas" accentColor="#17a2b8" onChange={handleInputChange} colSize="col-md-4" />
            <InputFloatingFlex label="CP" name="cp" value={formData.cp} icon="fas fa-mail-bulk" accentColor="#17a2b8" onChange={handleInputChange} colSize="col-md-3" />

          </div>
        </div>

        <div className="card border-0 shadow-sm mb-4 rounded-4 border-top border-4 bg-white" style={{ borderColor: "#dc3545" }}>
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="fw-bold mb-0" style={{ color: "#dc3545" }}>
                <i className="fas fa-pills me-2"></i>ALERGIAS A MEDICAMENTOS Y OTROS
              </h6>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary border-0"
                onClick={resetAlergias}
                title="Resetear alergias"
              >
                <i className="fas fa-undo me-1"></i> Limpiar selección
              </button>
            </div>
            <div className="row g-3">
              {[
                { id: "pen", name: "alergia_penicilina", label: "PENICILINA" },
                { id: "ter", name: "alergia_terramicina", label: "TERRAMICINA" },
                { id: "anes", name: "alergia_anestesia", label: "ANESTESIA" },
                { id: "lat", name: "alergia_latex", label: "LÁTEX" },
                { id: "aine", name: "alergia_aines", label: "AINEs / ASPIRINA" },
              ].map((alg) => (
                <div className="col-md-4" key={alg.id}>
                  <div className="d-flex align-items-center justify-content-between p-3 border rounded-3 bg-light shadow-sm">
                    <span className="small fw-bold text-dark">{alg.label}</span>
                    <div className="btn-group btn-group-sm">
                      <input type="radio" className="btn-check" name={alg.name} id={`${alg.id}-si`} value="SI" onChange={handleInputChange} checked={formData[alg.name] === "SI"} />
                      <label className="btn btn-outline-danger border-0 px-3" htmlFor={`${alg.id}-si`}>SÍ</label>
                      <input type="radio" className="btn-check" name={alg.name} id={`${alg.id}-no`} value="NO" onChange={handleInputChange} checked={formData[alg.name] === "NO"} />
                      <label className="btn btn-outline-secondary border-0 px-3" htmlFor={`${alg.id}-no`}>NO</label>
                    </div>
                  </div>
                </div>
              ))}

              {/* Otros */}
              <div className="col-12 mt-3">
                <InputFloatingFlex
                  label="Otras alergias (látex, alimentos, otros fármacos...)"
                  name="alergia_otros"
                  icon="fas fa-exclamation-circle"
                  accentColor="#dc3545"
                  onChange={handleInputChange}
                  colSize="col-12"
                />
              </div>
            </div>
          </div>
        </div>

        {/* EXPLORACIÓN FÍSICA */}
        <div className="card border-0 shadow-sm mb-4 rounded-4 border-top border-4 bg-white" style={{ borderColor: "#ffc107" }}>
          <div className="card-body p-4 text-dark">
            <h6 className="fw-bold mb-4" style={{ color: "#ffc107" }}><i className="fas fa-stethoscope me-2"></i>EXPLORACIÓN FÍSICA</h6>
            <div className="row g-3 align-items-center text-center">
              <div className="col-md-2">
                <label className="small fw-bold text-muted mb-1">Peso (kg)</label>
                <input type="number" name="peso" className="form-control border-0 bg-light text-dark text-center" value={formData.peso} onChange={handleInputChange} />
              </div>
              <div className="col-md-2">
                <label className="small fw-bold text-muted mb-1">Altura (cm)</label>
                <input type="number" name="altura" className="form-control border-0 bg-light text-dark text-center" value={formData.altura} onChange={handleInputChange} />
              </div>
              <div className="col-md-3">
                <div className="p-2 rounded-3 text-center shadow-sm" style={{ backgroundColor: infoIMC.color + '15', border: `1px solid ${infoIMC.color}` }}>
                  {/* VALOR REAL DEL PACIENTE (Lo que tú introduces) */}
                  <span className="d-block fw-bold small" style={{ color: infoIMC.color }}>IMC ACTUAL: {infoIMC.valor}</span>
                  <small className="fw-bold d-block mb-1" style={{ color: infoIMC.color, fontSize: '0.65rem' }}>{infoIMC.label}</small>

                  {/* VALORES NORMALES ESTIMADOS (La referencia médica) */}
                  {infoIMC.valor !== "--" && (
                    <div className="mt-1 pt-1 border-top border-secondary-subtle">
                      <small className="text-muted d-block" style={{ fontSize: '0.6rem', lineHeight: '1.1' }}>
                        VALORES NORMALES:
                      </small>
                      <strong className="text-dark" style={{ fontSize: '0.7rem' }}>
                        {infoIMC.ideal}
                      </strong>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-3">
                <label className="small fw-bold text-muted mb-1">Tensión</label>
                <input type="text" name="tension" className="form-control border-0 bg-light text-dark text-center" placeholder="120/80" onChange={handleInputChange} />
              </div>
              <div className="col-md-2">
                <label className="small fw-bold text-muted mb-1">Frec. Card.</label>
                <input type="number" name="frecuencia" className="form-control border-0 bg-light text-dark text-center" placeholder="72" onChange={handleInputChange} />
              </div>
            </div>
          </div>
        </div>

        {/* CUESTIONARIO */}
        <div className="row g-3">
          {secciones.map((sec, idx) => (
            <div className="col-md-6" key={idx}>
              <div className="card border-0 shadow-sm h-100 rounded-4 bg-white p-3 border-top border-4" style={{ borderColor: sec.color }}>
                <h6 className="fw-bold mb-3 small text-uppercase" style={{ color: sec.color }}>{sec.titulo}</h6>
                {sec.preguntas.map((p, i) => (
                  <CompactQuestion key={i} q={p.q} name={p.name} hasText={p.textarea} onChange={handleInputChange} accentColor={sec.color} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ANOTACIONES LIBRES */}
        <div className="mt-4 card border-0 shadow-sm rounded-4 overflow-hidden border-top border-4 bg-white"
          style={{ borderColor: "#566873" }}>
          <div className="card-body p-4">
            <h6 className="fw-bold mb-3" style={{ color: "#566873" }}>
              <i className="fas fa-file-medical-alt me-2"></i>ANOTACIONES LIBRES / EVOLUCIÓN CLÍNICA
            </h6>
            <textarea
              name="anotaciones"
              className="form-control border-0 p-3 shadow-sm"
              rows="5"
              placeholder="Escriba aquí el diagnóstico, plan de tratamiento o cualquier detalle relevante..."
              onChange={handleInputChange}
              style={{
                backgroundColor: "#f8fafb",
                borderRadius: '15px',
                fontSize: '1rem',
                resize: 'none',
                borderLeft: '5px solid #566873',
              }}
            ></textarea>
            <div className="text-end mt-2">
              <small style={{ color: "#93bbbf", fontStyle: "italic" }}>
                Información registrada en la historia clínica del paciente.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}