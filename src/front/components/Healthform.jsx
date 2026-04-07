import React from "react";

export default function Healthform() {
  const preguntas = [
    { question: "¿Goza usted de buena salud?" },
    { question: "¿Es usted alérgico?", textarea: true },
    { question: "¿Sufre de hipertensión arterial?" },
    { question: "¿Toma usted algún medicamento?", textarea: true },
    { question: "¿Sufre alguna enfermedad del corazón (Soplos, arritmias, etc)?", textarea: true },
    { question: "¿Tiene problemas de azúcar en sangre (Diabetes)?", textarea: true },
    { question: "¿Ha sufrido o sufre alguna enfermedad asociada a los riñones?", textarea: true },
    { question: "¿Ha sufrido o sufre alguna enfermedad asociada al hígado?", textarea: true },
    { question: "¿Ha sufrido o sufre alguna enfermedad pulmonar?", textarea: true },
    { question: "¿Padece o ha padecido de Cáncer?", textarea: true },
    { question: "¿Ha recibido Radiación?", textarea: true },
    { question: "¿Ha tenido alguna reacción a la anestesia?" },
    { question: "¿Le han realizado alguna cirugía?", textarea: true },
    { question: "¿Sufre o ha sufrido depresión?" },
    { question: "¿Consume alguna sustancia que genere drogodependencia?", textarea: true },
    { question: "¿Fuma o ingiere bebidas alcohólicas?" },
  ];

  const InputField = ({ label, placeholder, type = "text" }) => (
    <div className="col-md-6 mb-3">
      <label className="form-label fw-bold" style={{ color: "#566873" }}>{label}</label>
      <input type={type} className="form-control border-0 shadow-sm" style={{ backgroundColor: "#f8fafb" }} placeholder={placeholder} />
    </div>
  );

  const RadioGroup = ({ question, name, addTextarea = false }) => (
    <div className="mb-4 p-3 rounded" style={{ backgroundColor: "rgba(180, 210, 217, 0.1)" }}>
      <p className="fw-bold mb-2" style={{ color: "#566873" }}>{question}</p>
      <div className="form-check form-check-inline">
        <input className="form-check-input" type="radio" name={name} value="SI" id={`${name}-si`} />
        <label className="form-check-label" htmlFor={`${name}-si`}>SI</label>
      </div>
      <div className="form-check form-check-inline">
        <input className="form-check-input" type="radio" name={name} value="NO" id={`${name}-no`} />
        <label className="form-check-label" htmlFor={`${name}-no`}>NO</label>
      </div>
      {addTextarea && (
        <div className="mt-2">
          <textarea className="form-control border-0 shadow-sm" rows="2" placeholder="Explique detalles aquí..."></textarea>
        </div>
      )}
    </div>
  );

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: "#566873", fontWeight: "bold" }}>Alta de Nuevo Paciente</h2>
        <button className="btn text-white px-4" style={{ backgroundColor: "#e8888c" }}>Guardar Ficha</button>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm mb-4">
            <h5 className="card-header text-white border-0" style={{ backgroundColor: "#93bbbf" }}>
              <i className="fas fa-user-edit me-2"></i> Datos Personales
            </h5>
            <div className="card-body bg-white">
              <div className="row">
                <InputField label="Nombre" placeholder="Nombre completo" />
                <InputField label="Apellido" placeholder="Apellidos" />
                <InputField label="Email" type="email" placeholder="correo@ejemplo.com" />
                <InputField label="Teléfono" placeholder="+34 000 000 000" />
                <InputField label="Dirección" placeholder="Calle, número, piso" />
                <InputField label="Código Postal" placeholder="28000" />
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <h5 className="card-header text-white border-0" style={{ backgroundColor: "#93bbbf"}}>
              <i className="fas fa-file-medical me-2"></i> Historia Médica y Cuestionario
            </h5>
            <div className="card-body bg-white">
              <div className="row">
                {preguntas.map((pregunta, index) => (
                  <div className="col-md-6" key={index}>
                    <RadioGroup question={pregunta.question} name={`pregunta-${index}`} addTextarea={pregunta.textarea} />
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 border-top">
                <p className="fw-bold" style={{ color: "#566873" }}>Observaciones Adicionales</p>
                <textarea className="form-control mb-3 shadow-sm" rows="3" placeholder="Condiciones médicas no señaladas anteriormente..."></textarea>
                <p className="fw-bold" style={{ color: "#566873" }}>Antecedentes Familiares</p>
                <textarea className="form-control shadow-sm" rows="3" placeholder="Diabetes, hipertensión, etc. en la familia..."></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}