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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
        localStorage.setItem("userName", data.user.nombre);
       
        if (data.role === "medico") {
          navigate("/areapersonal");
        } else {
          navigate("/agenda");
        }

      } else {
        setError(data.msg || "Credenciales incorrectas");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

 return (
  <div className="fondo-pantalla d-flex justify-content-center align-items-center vh-100">
    <div className="card shadow-lg border-0 p-4 rounded-3" style={{ maxWidth: "500px", width: "100%" }}>
      <div className="d-flex justify-content-center m-4">
        <img src={icon} alt="icon" style={{ width: "200px" }} />
      </div>

      {error && <div className="alert alert-danger p-2 small text-center">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          <a href="#" className="small text-decoration-none">¿Olvidaste tu contraseña?</a>
          <Link to="/signup" className="small text-decoration-none">Registrar una cuenta</Link>
        </div>
      </form>
    </div>
  </div>
  );
}