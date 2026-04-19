import React, { useState } from "react";
import icon from "../assets/img/gecap_navbar_clean.png";
import "../pages/login.css";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export default function Login() {
  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({
          type: "login_user",
          payload: {
            token: data.token,
            user: data.user,
            role: data.role
          }
        });

        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.role);


        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/areapersonal");

      } else {
        setError(data.msg || "Credenciales incorrectas");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="fondo-pantalla d-flex justify-content-center align-items-center vh-100">
           
      <div className="d-flex flex-column align-items-center" style={{ width: "100%", maxWidth: "500px" }}>
              
        <div className="card shadow-lg border-0 p-4 rounded-3 w-100">
          <div className="d-flex justify-content-center m-4">
            <img src={icon} alt="icon" style={{ width: "200px" }} />
          </div>

          <h5 className="text-center mb-3 fw-bold" style={{ color: "#5e888c" }}>Acceso Profesionales</h5>

          {error && <div className="alert alert-danger p-2 small text-center">{error}</div>}

          <form onSubmit={handleSubmit} autoComplete="off">
            <input type="text" style={{ display: 'none' }} name="fake_email" />
            <input type="password" style={{ display: 'none' }} name="fake_password" />

            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                name="email_professional"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="none"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password_secure"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  style={{ borderRight: "none" }}
                />
                <span
                  className="input-group-text bg-white border-start-0"
                  style={{ cursor: "pointer", color: "#5e888c" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </span>
              </div>
            </div>

            <button type="submit" className="btn w-100 my-4 rounded-4 text-white" style={{ backgroundColor: "#5e888c" }}>
              Entrar
            </button>

            <div className="d-flex justify-content-between">
              <a href="#" className="small text-decoration-none text-muted">¿Olvidaste tu contraseña?</a>
              <Link to="/signup" className="small text-decoration-none" style={{ color: "#5e888c" }}>Registrar cuenta</Link>
            </div>
          </form>
        </div> 

        <div className="text-center mt-3">
          <Link to="/" className="text-decoration-none small fw-bold" style={{ color: "#5e888c" }}>
            <i className="fas fa-arrow-left me-2"></i>Volver a la página principal
          </Link>
        </div>
      </div> 
    </div>
  );
}