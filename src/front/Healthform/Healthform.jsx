import React from "react";
import faviconGecap from "../assets/img/favicon.png"

export default function Healthform() {

  const preguntas = [


    {question:"¿Goza usted de buena salud?"},
    {question: "¿Es usted alérgico?", textarea: true},
    {question:"¿Sufre de hipertensión arterial?"},
    {question: "¿Toma usted algún medicamento?", textarea: true},
    {question:"¿Sufre alguna enfermedad del corazón (Soplos,arritmias,etc)?"},
    {question:"¿Tiene problemas de azucar en sangre (Diabetes)?", textarea:true},
    {question:"¿Ha sufrido o sufre alguna enfermedad asociada a los riñones?", textarea:true},
    {question:"¿Ha sufrido o sufre alguna enfermedad asociada al higado?", textarea:true},
    {question:"¿Ha sufrido o sufre alguna enfermedad pulmonar?", textarea:true},
    {question:"¿Padece o ha padecido de Cancer?", textarea:true},
    {question:"¿Ha recibido Radiación?", textarea:true},
    {question:"¿Ha tenido alguna reacción a la anestesia?"},
    {question:"¿Le han realizado alguna cirugía?", textarea:true},
    {question:"¿Sufre o ha sufrido depresión?"},
    {question:"¿Consume alguna sustancia que genere drogodependencia?", textarea:true},
    {question:"¿Fuma o ingiere bebidas alcohólicas?"},
  ]

  const InputField = ({ label, placeholder, type = "text" }) => (
    <div className="col-md-6 mb-3">
      <label className="form-label">{label}</label>
      <input type={type} className="form-control" placeholder={placeholder} />
    </div>
  );

  const RadioGroup = ({ question, name, addTextarea=false }) => (
    <div className="mb-3">
      <p className="fw-bold">{question}</p>

      <div className="form-check form-check-inline">
        <input className="form-check-input" type="radio" name={name} value="SI" />
        <label className="form-check-label">SI</label>
      </div>

      <div className="form-check form-check-inline">
        <input className="form-check-input" type="radio" name={name} value="NO" />
        <label className="form-check-label">NO</label>
      </div>
   

      {addTextarea && (
      <div className="mt-2">
        <label className="form-label small text-muted">Explique</label>
        <textarea className="form-control" rows="2"></textarea>
      </div>
    )}
     </div>
  );

  return (
    <div className="container-fluid">

      <div className="row">
        <div className="col-md-2 col-lg-1 text-white p-3"
          style={{ backgroundColor: "#5e888c", minHeight: "100vh" }}>
          <img src={faviconGecap} alt="logo" height="60" className="mb-4" />
          <ul className="nav flex-column">
            <li className="nav-item"><a className="nav-link text-white fw-bold" href="#">Inicio</a></li>
            <li className="nav-item"><a className="nav-link text-white fw-bold" href="#">Calendario</a></li>
            <li className="nav-item"><a className="nav-link text-white fw-bold" href="#">Contacto</a></li>
          </ul>
        </div>

        <div className="col-md-10 p-4">
          <div className="border rounded shadow-sm p-3 mb-4 bg-light">
            <h5 className="text-white p-2 rounded mb-3"
              style={{ backgroundColor: "#5e888c" }}>
              Datos personales
            </h5>

            <div className="row">
              <InputField label="Nombre" placeholder="Nombre" />
              <InputField label="Apellido" placeholder="Apellido" />
              <InputField label="Email" type="email" placeholder="Email" />
              <InputField label="Teléfono" placeholder="Teléfono" />
              <InputField label="Direccion" placeholder="Direccion" />
              <InputField label="Codigo Postal" placeholder="Codigo postal" />

            </div>
          </div>

          <div className="border rounded shadow-sm p-3 bg-light">
            <h5 className="text-white p-2 rounded mb-3"
              style={{ backgroundColor: "#5e888c" }}>
              Historia Médica
            </h5>

            {preguntas.map((pregunta, index) => (
              <RadioGroup key={index} question={pregunta.question} name={`pregunta-${index}`} addTextarea={pregunta.textarea} />
            ))}


            <div className="mb-3">
              <p className="mb-1 fw-bold">¿Alguna condición medica no señalada anteriormente?</p>
              <div className="mt-2">
                <label for="Med" className="form-label small text-muted">Explique</label>
                <textarea className="form-control" id="Med" rows="2"></textarea>
              </div>
            </div>
            <div className="mb-3">
              <p className="mb-1 fw-bold">Antecedentes familiares</p>
              <div className="mt-2">
                <label for="antMed" className="form-label small text-muted">Explique</label>
                <textarea className="form-control" id="antMed" rows="2"></textarea>
              </div>
            </div>
          </div>


        </div>

      </div>
    </div>
  );
}
