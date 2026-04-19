import React, { useState } from "react"; // Añadido React para evitar advertencias
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";
import logo from "../assets/img/gecap_navbar_clean.png";

function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "medico"
    });
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return setError("Por favor, introduce un correo electrónico válido.");
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            return setError("La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula y un número.");
        }

        if (formData.password !== formData.confirmPassword) {
            return setError("Las contraseñas no coinciden.");
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    nombre: `${formData.firstName} ${formData.lastName}`,
                    role: formData.role 
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Cuenta de profesional creada con éxito. Ahora puedes iniciar sesión.");
                navigate("/login");
            } else {
                setError(data.msg || "Error en el registro");
            }
        } catch (err) {
            setError("No se pudo conectar con el servidor");
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-card">
                <div className="signup-logo">
                    <img src={logo} alt="Logo GECAP" />
                </div>

                <h5 className="text-center mb-4 fw-bold" style={{ color: "#5e888c" }}>Registro de Profesional</h5>

                {error && <div className="alert alert-danger p-2 small text-center">{error}</div>}
               
                <form
                    className="signup-form"
                    onSubmit={handleSubmit}
                    autoComplete="off"
                >
                
                    <input
                        type="text"
                        name="firstName"
                        placeholder="Nombre"
                        value={formData.firstName} 
                        onChange={handleChange}
                        autoComplete="new-name" 
                        required
                    />
                    
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Apellido"
                        value={formData.lastName}
                        onChange={handleChange}
                        autoComplete="new-surname"
                        required
                    />
                 
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo electrónico profesional"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="new-email"
                        required
                    />
                    
                    <div className="input-group mb-3">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="form-control"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password" 
                            required
                        />
                        <span className="input-group-text bg-light border-0" onClick={togglePasswordVisibility} style={{ cursor: "pointer" }}>
                            <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} style={{ color: "#5e888c" }}></i>
                        </span>
                    </div>
                    
                    <div className="input-group mb-3">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            className="form-control"
                            placeholder="Confirmar contraseña"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <button type="submit" className="mt-2 w-100">Crear cuenta profesional</button>
                </form>

                <div className="signup-links">
                    <Link to="/login">¿Ya tienes una cuenta? Inicia sesión</Link>
                </div>
            </div>
        </div>
    );
}

export default SignUp;