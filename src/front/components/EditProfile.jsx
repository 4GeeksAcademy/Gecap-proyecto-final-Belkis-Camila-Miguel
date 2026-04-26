import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

export function EditProfile() {
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        dni: "",
        telefono: "",
        direccion: "",
        especialidad: "",
        num_colegiado: "",
        password: "",
        confirmPassword: ""
    });
    const [status, setStatus] = useState({ msg: null, type: "" });

    useEffect(() => {
        const user = store.user || JSON.parse(localStorage.getItem("user"));
        if (user) {
            setFormData(prev => ({
                ...prev,
                nombre: user.user_name || "",
                email: user.email || ""
            }));
        }
    }, [store.user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ msg: null, type: "" });

        const updateData = {
            nombre: formData.nombre,
            email: formData.email,
            dni: formData.dni,
            telefono: formData.telefono,
            direccion: formData.direccion,
            especialidad: formData.especialidad,
            num_colegiado: formData.num_colegiado
        };

        if (formData.password && formData.password.trim() !== "") {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
            if (!passwordRegex.test(formData.password)) {
                return setStatus({ msg: "La nueva contraseña no cumple los requisitos.", type: "danger" });
            }
            if (formData.password !== formData.confirmPassword) {
                return setStatus({ msg: "Las contraseñas no coinciden.", type: "danger" });
            }

            updateData.password = formData.password;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/update-profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (response.ok) {
                dispatch({ type: "login_user", payload: { ...store, user: data.user } });
                localStorage.setItem("user", JSON.stringify(data.user));
                setStatus({ msg: "Perfil actualizado correctamente", type: "success" });
                setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));

                setTimeout(() => {
                    navigate("/equipo");
                }, 1500);

            } else {
                setStatus({ msg: data.msg || "Error al actualizar", type: "danger" });
            }
        } catch (error) {
            setStatus({ msg: "Error de conexión con el servidor", type: "danger" });
        }
    };
    return (
        <div className="container mt-5">
            <div className="mb-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
                <button
                    onClick={() => navigate("/equipo")}
                    className="btn btn-link text-decoration-none p-0"
                    style={{ color: "#5e888c", fontWeight: "bold" }}
                >
                    <i className="fas fa-arrow-left me-2"></i> Volver al listado de médicos
                </button>
            </div>
            <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "600px", borderTop: "5px solid #5e888c" }}>
                <h4 className="mb-4" style={{ color: "#5e888c" }}>Configuración de Cuenta</h4>

                {status.msg && <div className={`alert alert-${status.type} small text-center`}>{status.msg}</div>}

                <form onSubmit={handleSubmit}>
                    <h6 className="text-muted text-uppercase small fw-bold mb-3" style={{ color: "#5e888c" }}>Datos Identificativos</h6>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold small">Nombre y Apellidos</label>
                            <input type="text" name="nombre" className="form-control" value={formData.nombre} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold small">DNI / NIE</label>
                            <input type="text" name="dni" className="form-control" value={formData.dni} onChange={handleChange} placeholder="Ej: 12345678X" />
                        </div>
                    </div>

                    <h6 className="text-muted text-uppercase small fw-bold mt-3 mb-3" style={{ color: "#5e888c" }}>Información de Contacto</h6>
                    <div className="mb-3">
                        <label className="form-label fw-bold small">Dirección Profesional</label>
                        <input type="text" name="direccion" className="form-control" value={formData.direccion} onChange={handleChange} placeholder="Calle, Número, Ciudad" />
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold small">Teléfono</label>
                            <input type="text" name="telefono" className="form-control" value={formData.telefono} onChange={handleChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold small">Correo Electrónico</label>
                            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                        </div>
                    </div>

                    <h6 className="text-muted text-uppercase small fw-bold mt-3 mb-3" style={{ color: "#5e888c" }}>Datos Colegiales</h6>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold small">Especialidad</label>
                            <input type="text" name="especialidad" className="form-control" value={formData.especialidad} onChange={handleChange} placeholder="Ej: Cardiología" />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold small">Nº de Colegiado</label>
                            <input type="text" name="num_colegiado" className="form-control" value={formData.num_colegiado} onChange={handleChange} />
                        </div>
                    </div>

                    <hr className="my-4" />
                    <h6 className="text-muted text-uppercase small fw-bold mb-3">Seguridad</h6>
                    <p className="text-muted small">Deja estos campos en blanco si no deseas cambiar tu contraseña.</p>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold small">Nueva Contraseña</label>
                            <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold small">Confirmar Contraseña</label>
                            <input type="password" name="confirmPassword" className="form-control" value={formData.confirmPassword} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="d-flex gap-2 mt-4">
                        <button
                            type="submit"
                            className="btn flex-grow-1 py-2 fw-bold"
                            style={{ backgroundColor: "#5e888c", color: "white" }}
                        >
                            Guardar cambios
                        </button>
                        <button
                            type="button"
                            className="btn btn-light border flex-grow-1 py-2 fw-bold"
                            onClick={() => navigate("/equipo")}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
}