import React from "react";
import icon from "../assets/img/gecap_navbar_clean.png";
import "./login.css"

export default function Login() {

  const datosDinamicos = [
    { label: "Correo electrónico", type: "email", placeholder: "nombre@ejemplo.com" },
    { label: "Contraseña", type: "password", placeholder: "" }
  ];

  const InputField = ({ label, type, placeholder }) => (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input type={type} className="form-control" placeholder={placeholder} required />
    </div>
  );

  return (
    <div className="fondo-pantalla d-flex justify-content-center align-items-center vh-100">

      <div className="card shadow-lg border-0 p-4 rounded-3" style={{ maxWidth: "500px", width: "100%" }}>
        
        <div className="d-flex justify-content-center m-4">
          <img src={icon} alt="icon" style={{ width: "200px" }} />
        </div>

        <form>

          {datosDinamicos.map((datosDinamicos, index) => (
            <InputField
              key={index} label={datosDinamicos.label} type={datosDinamicos.type} placeholder={datosDinamicos.placeholder}/>
          ))}

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">
                Recordarme
              </label>
            </div>
          </div>

          <button type="submit" className="btn w-100 my-4 rounded-4 text-white" style={{ backgroundColor: "#5e888c" }}>
            Entrar
          </button>

          <div className="d-flex justify-content-between">
            <a href="#" className="small text-decoration-none">
              ¿Olvidaste tu contraseña?
            </a>
            <a href="#" className="small text-decoration-none">
              Registrar una cuenta
            </a>
          </div>

        </form>
      </div>
    </div>
  );
}