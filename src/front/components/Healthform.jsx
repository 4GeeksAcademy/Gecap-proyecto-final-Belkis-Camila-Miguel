import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

// --- COMPONENTES AUXILIARES ---
const InputFloatingFlex = ({ label, name, type = "text", icon, onChange, accentColor, colSize = "col-md-4", value, required = false, warning }) => (
  <div className={`${colSize} mb-2`}>
    {/* El title aquí genera el mensaje al pasar el cursor */}
    <div className="form-floating shadow-sm" title={warning || ""}>
      <input
        type={type}
        name={name}
        className={`form-control border-0 bg-light text-dark ${warning ? 'is-invalid border-start border-danger border-3' : ''}`}
        placeholder={label}
        onChange={onChange}
        value={value || ""}
        required={required}
        style={{ fontSize: '0.9rem' }}
      />
      <label className={`small ${warning ? 'text-danger fw-bold' : 'text-muted'}`}>
        <i className={`${icon} me-2`} style={{ color: warning ? '#dc3545' : accentColor }}></i>
        {label} {required && <span className="text-danger">*</span>}
        {warning && <i className="fas fa-exclamation-triangle ms-1"></i>}
      </label>
    </div>
  </div>
);

const CompactQuestion = ({ q, name, hasText, onChange, accentColor, warning, value }) => (
  <div className={`py-2 border-bottom ${warning ? 'bg-danger bg-opacity-10' : 'border-light'}`} title={warning || ""}>
    <div className="d-flex align-items-center justify-content-between">
      <span className={`small fw-semibold ${warning ? 'text-danger' : 'text-secondary'}`}>
        {warning && <i className="fas fa-exclamation-triangle me-1"></i>}
        {q}
      </span>
      <div className="btn-group btn-group-sm ms-3 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden' }}>
        <input type="radio" className="btn-check" name={name} id={`${name}-si`} value="SI" checked={value === "SI"} onChange={onChange} />
        <label className={`btn ${warning ? 'btn-danger' : 'btn-outline-success'} border-0 px-3`} htmlFor={`${name}-si`}>SÍ</label>
        <input type="radio" className="btn-check" name={name} id={`${name}-no`} value="NO" checked={value === "NO"} onChange={onChange} />
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
    hepatitis: "NO", tuberculosis: "NO", vih: "NO",
    radiacion_cabeza: "NO", osteoporosis: "NO",
    glucosa: "", embarazo: "NO", spo2: "", grupoSanguineo: "",

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
  if (formData.hepatitis === "SI") alertasActivas.push({ msg: "PROTOCOLO: HEPATITIS", color: "danger", icon: "fa-virus" });
  if (formData.tuberculosis === "SI") alertasActivas.push({ msg: "PROTOCOLO: TUBERCULOSIS", color: "danger", icon: "fa-lungs" });
  if (formData.vih === "SI") alertasActivas.push({ msg: "PROTOCOLO: VIH+", color: "danger", icon: "fa-biohazard" });
  if (formData.osteoporosis === "SI") alertasActivas.push({ msg: "ATENCIÓN: BIFOSFONATOS (RIESGO NECROSIS)", color: "warning", icon: "fa-bone" });
  if (formData.radiacion_cabeza === "SI") alertasActivas.push({ msg: "ANTECEDENTE: RADIACIÓN CABEZA/CUELLO", color: "warning", icon: "fa-radiation" });

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
        { q: "¿Es fumador?", name: "habitos" },
        { q: "¿Consume alcohol?", name: "habitos" },
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
          {formData.embarazo === "SI" && (
            <div className="alert alert-danger border-0 shadow mi-alerta-viva d-flex align-items-center mb-2">
              <i className="fas fa-baby me-3 fa-2xl"></i>
              <div>
                <div className="fw-bold text-uppercase small" style={{ letterSpacing: '1px' }}>Condición Crítica Detectada</div>
                <div className="fw-bold h5 mb-0">PACIENTE EMBARAZADA: PROHIBIDO Rx Y REVISAR FÁRMACOS</div>
              </div>
            </div>
          )}
          {formData.glucosa > 200 && (
            <div className="alert alert-warning border-0 shadow d-flex align-items-center mb-2" style={{ borderLeft: '5px solid #ffc107' }}>
              <i className="fas fa-droplet me-3 fa-2xl text-danger"></i>
              <div>
                <div className="fw-bold text-uppercase small" style={{ letterSpacing: '1px' }}>Alerta Metabólica</div>
                <div className="fw-bold mb-0">HIPERGLUCEMIA DETECTADA: {formData.glucosa} mg/dL (Riesgo Quirúrgico)</div>
              </div>
            </div>
          )}
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
            <InputFloatingFlex label="Nombre" name="nombre" value={formData.nombre} icon="fas fa-user" accentColor="#17a2b8" onChange={handleInputChange} colSize="col-md-4" required={true} />
            <InputFloatingFlex label="Apellidos" name="apellidos" value={formData.apellidos} icon="fas fa-users" accentColor="#17a2b8" onChange={handleInputChange} colSize="col-md-4" required={true} />
            <InputFloatingFlex label="DNI / NIE" name="dni" value={formData.dni} icon="fas fa-id-card" accentColor="#17a2b8" onChange={handleInputChange} colSize="col-md-4" required={true} />

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
            <InputFloatingFlex label="Dirección" name="direccion" value={formData.direccion} icon="fas fa-map-marker-alt" accentColor="#17a2b8" onChange={handleInputChange} colSize="col-md-12" />
            <InputFloatingFlex label="Ciudad" name="ciudad" value={formData.ciudad} icon="fas fa-city" accentColor="#17a2b8" onChange={handleInputChange} colSize="col-md-5" />
            <InputFloatingFlex label="País" name="pais" value={formData.pais} icon="fas fa-globe-americas" accentColor="#17a2b8" onChange={handleInputChange} colSize="col-md-4" />
            <InputFloatingFlex label="CP" name="cp" value={formData.cp} icon="fas fa-mail-bulk" accentColor="#17a2b8" onChange={handleInputChange} colSize="col-md-3" />
          </div>
        </div>

        <div className="card border-0 shadow-sm mb-4 rounded-4 border-top border-4 bg-white" style={{ borderColor: "#6f42c1" }}>
          <div className="card-body p-4">
            <h6 className="fw-bold mb-4" style={{ color: "#6f42c1" }}>
              <i className="fas fa-biohazard me-2"></i>RIESGOS MÉDICOS Y BIOSEGURIDAD
            </h6>
            <div className="row g-3">
              {[
                { name: "hepatitis", label: "HEPATITIS", msg: "Riesgo biológico. Protocolo de esterilización reforzado." },
                { name: "tuberculosis", label: "TUBERCULOSIS", msg: "Contagio por aire. Uso de mascarilla FFP3 obligatorio." },
                { name: "vih", label: "VIH", msg: "Paciente inmunodeprimido. Vigilancia de infecciones." },
                { name: "osteoporosis", label: "OSTEOPOROSIS / BIFOSFONATOS", msg: "¡ALERTA! Riesgo de osteonecrosis en cirugía/extracciones." },
                { name: "radiacion_cabeza", label: "RADIACIÓN CABEZA/CUELLO", msg: "Antecedente de radioterapia: fragilidad ósea y xerostomía." },
                { name: "cancer", label: "CÁNCER (ACTIVO/ANTECEDENTE)", msg: "Evaluar estado general y medicación oncológica." },
                { name: "embarazo", label: "EMBARAZO", msg: "¡CRÍTICO! Paciente embarazada. Prohibido radiografías sin protección/justificación y verificar fármacos." },
              ].map((item) => {
                const activo = formData[item.name] === "SI"; // Definimos la condición

                return (
                  <div className="col-md-6 col-lg-4" key={item.name}>
                    <div
                      /* Aplicamos la misma clase que usamos en alergias */
                      className={`d-flex align-items-center justify-content-between p-3 rounded-3 shadow-sm ${activo ? 'mi-alerta-viva' : 'bg-light border'}`}
                      title={activo ? item.msg : "Sin riesgo reportado"}
                      style={{ cursor: activo ? 'help' : 'default', transition: 'all 0.3s' }}
                    >
                      <span className={`small fw-bold ${activo ? 'text-danger' : 'text-secondary'}`}>
                        {activo && <i className="fas fa-biohazard me-2"></i>}
                        {item.label}
                      </span>
                      <div className="btn-group btn-group-sm">
                        <input type="radio" className="btn-check" name={item.name} id={`${item.name}-si`} value="SI" onChange={handleInputChange} checked={formData[item.name] === "SI"} />
                        <label className={`btn ${activo ? 'btn-danger' : 'btn-outline-danger'} border-0 px-3`} htmlFor={`${item.name}-si`}>SÍ</label>
                        <input type="radio" className="btn-check" name={item.name} id={`${item.name}-no`} value="NO" onChange={handleInputChange} checked={formData[item.name] === "NO"} />
                        <label className="btn btn-outline-secondary border-0 px-3" htmlFor={`${item.name}-no`}>NO</label>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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

              <style>
                {`@keyframes parpadeo-urgente { 0% { background-color: rgba(220, 53, 69, 0.1); transform: scale(1); } 50% { background-color: rgba(220, 53, 69, 0.3); transform: scale(0.98); }
                  100% { background-color: rgba(220, 53, 69, 0.1); transform: scale(1); }}.mi-alerta-viva 
                  { animation: parpadeo-urgente 1.5s 
                   infinite ease-in-out !important; 
                   border: 2px solid #dc3545 !important; 
                   }
               `}
              </style>

              {[
                { id: "pen", name: "alergia_penicilina", label: "PENICILINA" },
                { id: "ter", name: "alergia_terramicina", label: "TERRAMICINA" },
                { id: "anes", name: "alergia_anestesia", label: "ANESTESIA" },
                { id: "lat", name: "alergia_latex", label: "LÁTEX" },
                { id: "aine", name: "alergia_aines", label: "AINEs / ASPIRINA" },
              ].map((alg) => {
                const esCritico = formData[alg.name] === "SI";

                return (
                  <div className="col-md-4" key={alg.id}>
                    <div
                      className={`d-flex align-items-center justify-content-between p-3 rounded-3 shadow-sm ${esCritico ? 'mi-alerta-viva' : 'bg-light border'}`}
                      title={esCritico ? `¡ALERTA CRÍTICA! Paciente alérgico a: ${alg.label}` : ""}
                      style={{ cursor: esCritico ? 'help' : 'default', transition: 'all 0.3s' }}
                    >
                      <span className={`small fw-bold ${esCritico ? 'text-danger' : 'text-dark'}`}>
                        {esCritico && <i className="fas fa-exclamation-triangle me-2"></i>}
                        {alg.label}
                      </span>
                      <div className="btn-group btn-group-sm">
                        <input
                          type="radio"
                          className="btn-check"
                          name={alg.name}
                          id={`${alg.id}-si`}
                          value="SI"
                          onChange={handleInputChange}
                          checked={formData[alg.name] === "SI"}
                        />
                        <label className={`btn ${esCritico ? 'btn-danger' : 'btn-outline-danger'} border-0 px-3`} htmlFor={`${alg.id}-si`}>SÍ</label>

                        <input
                          type="radio"
                          className="btn-check"
                          name={alg.name}
                          id={`${alg.id}-no`}
                          value="NO"
                          onChange={handleInputChange}
                          checked={formData[alg.name] === "NO"}
                        />
                        <label className="btn btn-outline-secondary border-0 px-3" htmlFor={`${alg.id}-no`}>NO</label>
                      </div>
                    </div>
                  </div>
                );
              })}

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
          <div className="card-body p-4">
            <h6 className="fw-bold mb-4" style={{ color: "#ffc107" }}>
              <i className="fas fa-stethoscope me-2"></i>EXPLORACIÓN FÍSICA Y CONSTANTES
            </h6>

            <div className="row g-4 align-items-center">

              {/* BLOQUE A: COMPOSICIÓN CORPORAL */}
              <div className="col-lg-4 border-end border-light">
                <div className="row g-2 text-center">
                  <div className="col-6">
                    <label className="small fw-bold text-muted mb-1">Peso (kg)</label>
                    <input type="number" name="peso" className="form-control border-0 bg-light text-center" value={formData.peso} onChange={handleInputChange} />
                  </div>
                  <div className="col-6">
                    <label className="small fw-bold text-muted mb-1">Altura (cm)</label>
                    <input type="number" name="altura" className="form-control border-0 bg-light text-center" value={formData.altura} onChange={handleInputChange} />
                  </div>
                  <div className="col-12 mt-2">
                    <div className="p-2 rounded-3 text-center shadow-sm" style={{ backgroundColor: infoIMC.color + '15', border: `1px solid ${infoIMC.color}` }}>
                      <span className="fw-bold small" style={{ color: infoIMC.color }}>IMC: {infoIMC.valor} ({infoIMC.label})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* BLOQUE B: SIGNOS VITALES CRÍTICOS */}
              <div className="col-lg-8">
                <div className="row g-3 text-center">

                  {/* GRUPO SANGUÍNEO */}
                  <div className="col-md-4">
                    <label className="small fw-bold text-muted mb-1 d-block">Grupo Sanguíneo</label>
                    <select
                      name="grupoSanguineo"
                      className="form-select border-0 bg-light text-center fw-bold"
                      value={formData.grupoSanguineo}
                      onChange={handleInputChange}
                      style={{ fontSize: '0.9rem', height: '38px' }}
                    >
                      <option value="">--</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  {/* TENSIÓN */}
                  <div className="col-md-4">
                    <label className="small fw-bold text-muted mb-1 d-block">Tensión Art.</label>
                    <input
                      type="text"
                      name="tension"
                      className={`form-control border-0 text-center fw-bold ${parseInt(formData.tension) > 140 ? 'bg-danger text-white' : 'bg-light'}`}
                      placeholder="120/80"
                      onChange={handleInputChange}
                      style={{ height: '38px' }}
                    />
                  </div>

                  {/* FRECUENCIA */}
                  <div className="col-md-4">
                    <label className="small fw-bold text-muted mb-1 d-block">Frec. Card.</label>
                    <input
                      type="number"
                      name="frecuencia"
                      className="form-control border-0 bg-light text-center fw-bold"
                      placeholder="72"
                      onChange={handleInputChange}
                      style={{ height: '38px' }}
                    />
                  </div>

                  {/* GLUCOSA */}
                  <div className="col-md-4">
                    <label className="small fw-bold text-muted mb-1 d-block">Glucosa (mg/dL)</label>
                    <input
                      type="number"
                      name="glucosa"
                      className={`form-control border-0 text-center fw-bold ${formData.glucosa > 180 ? 'alerta-critica text-danger' : 'bg-light'}`}
                      value={formData.glucosa}
                      onChange={handleInputChange}
                      placeholder="90"
                      style={{ height: '38px' }}
                    />
                  </div>

                  {/* SpO2 */}
                  <div className="col-md-4">
                    <label className="small fw-bold text-muted mb-1 d-block">Saturación O2</label>
                    <input
                      type="number"
                      name="spo2"
                      className={`form-control border-0 text-center fw-bold ${formData.spo2 < 94 && formData.spo2 > 0 ? 'bg-warning-subtle text-warning' : 'bg-light'}`}
                      value={formData.spo2}
                      onChange={handleInputChange}
                      placeholder="98%"
                      style={{ height: '38px' }}
                    />
                  </div>

                  <div className="col-md-4"></div>

                </div>
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