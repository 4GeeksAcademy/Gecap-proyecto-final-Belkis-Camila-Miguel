import { useState } from "react";  /*Herramienta de React para guardar datos*/
import "./SignUp.css";
import logo from "../assets/gecap-logo.JPG";

function SignUp() {

    const [formData, setFormData] = useState({   /*se guardan los valores del formulario, el set función que actualiza esos datos*/
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (event) => {    /*Actualiza el estado cada vez que el usuario escribe en un input */
        const { name, value } = event.target;  /*Los inputs y se puede acceder a las propiedades */

        setFormData({
            ...formData, /* se copian todos los datos anteriores */
            [name]: value /* actualiza solo el campo que se cambio */
        });
    };

    const handleSubmit = (event) => {    /* se ejecuta cuando el usuario hace clic en el botón. */
        event.preventDefault();          /*evita que el formulario recargue la página*/
        console.log("Datos del formulario:", formData);
    };

    return (
        <div className="signup-page">
            <div className="signup-card">
                <div className="signup-logo">
                    <img src={logo} alt="Logo GECAP" />
                </div>

                <form className="signup-form" onSubmit={handleSubmit}>
                    <input type="text" name="firstName" placeholder="Nombre" onChange={handleChange} />
                    <input type="text" name="lastName" placeholder="Apellido" onChange={handleChange} />
                    <input type="email" name="email" placeholder="Correo electrónico" onChange={handleChange} />
                    <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} />
                    <input type="password" name="confirmPassword" placeholder="Confirmar contraseña" onChange={handleChange} />

                    <button type="submit">Crear cuenta</button>
                </form>

                <div className="signup-links">
                    <a href="#">¿Ya tienes una cuenta? Inicia sesión</a>
                </div>
            </div>
        </div>
    );
}

export default SignUp;