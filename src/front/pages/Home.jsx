import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
	const [solicitud, setSolicitud] = useState({
		nombre: "",
		dni: "",
		telefono: "",
		motivo: "Control Rutinario"
	});

	const manejarEnvioCita = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/external-appointment`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(solicitud)
			});

			if (response.ok) {
				alert("¡Solicitud enviada con éxito! El médico contactará contigo pronto.");
				setSolicitud({ nombre: "", telefono: "", motivo: "Control Rutinario" });

				const modalElement = document.getElementById('citaRapidaModal');
				const modal = bootstrap.Modal.getInstance(modalElement);
				modal.hide();
			} else {
				alert("Hubo un error al enviar la solicitud.");
			}
		} catch (error) {
			console.error("Error:", error);
			alert("No se pudo conectar con el servidor.");
		}
	};

	const [dniBusqueda, setDniBusqueda] = useState("");
	const navigate = useNavigate();

	const irAMisCitas = (e) => {
		e.preventDefault();
		if (dniBusqueda.trim() !== "") {
			navigate(`/mis-citas/${dniBusqueda.toUpperCase()}`);
		}
	};

	return (
		<div style={{ backgroundColor: "#ebf2f1", minHeight: "100vh" }}>

			<header className="container-fluid py-5" style={{ minHeight: "80vh", display: "flex", alignItems: "center" }}>
				<div className="container">
					<div className="row align-items-center">
						<div className="col-lg-6 text-start">
							<h1 className="display-3 fw-bold mb-3" style={{ color: "#566873" }}>
								Gestión Sanitaria <br />
								<span style={{ color: "#5e888c" }}>Centros de atencion Primaria</span>
							</h1>
							<p className="lead mb-4" style={{ color: "#566873", opacity: 0.9 }}>
								Centraliza la atención médica en una sola plataforma.
								Conecta a profesionales y pacientes con la tecnología de GECAP.
							</p>
							<div className="d-flex gap-3">
								<a href="#servicios"
									className="btn btn-lg px-4 shadow-sm"
									style={{
										backgroundColor: "#5e888c",
										color: "#ebf2f1",
										borderRadius: "12px",
										border: "none",
										transition: "transform 0.3s ease",
										textDecoration: "none",
										display: "inline-block"
									}}
									onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
									onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
									onClick={(e) => {
										e.preventDefault();
										document.getElementById('servicios').scrollIntoView({ behavior: 'smooth' });
									}}>
									Ver Servicios
								</a>
								<button className="btn btn-lg px-4"
									style={{
										color: "var(--gecap-action)",
										backgroundColor: "rgba(94, 136, 140, 0.05)",
										border: "3px solid var(--gecap-action)",
										boxShadow: "0 4px 14px 0 rgba(94, 136, 140, 0.3)",
										borderRadius: "12px",
										transition: "all 0.3s ease"
									}}
									onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
									onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
									data-bs-toggle="modal"
									data-bs-target="#nosotrosModal">
									Saber más
								</button>
							</div>
						</div>

						<div className="col-lg-6 d-none d-lg-block position-relative">
							<div style={{
								position: "absolute",
								top: "-20px",
								right: "-20px",
								width: "100%",
								height: "100%",
								backgroundColor: "#b4d2d9",
								borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70% ",
								zIndex: 0,
								opacity: 0.4
							}}></div>
							<img
								src="/SaludDigital.jpeg"
								alt="Salud Digital"
								className="img-fluid rounded-4 shadow-lg position-relative"
								style={{ zIndex: 1 }}
							/>
						</div>
					</div>
				</div>
			</header>

			<section id="portal-paciente" className="py-5" style={{ backgroundColor: "#ffffff" }}>
				<div className="container">
					<div className="text-center mb-5">
						<h2 className="fw-bold" style={{ color: "#566873" }}>Portal del Paciente</h2>
						<div style={{ width: "60px", height: "4px", backgroundColor: "#e8888c", margin: "10px auto" }}></div>
						<p className="text-muted">Gestiona tus consultas de forma sencilla y privada.</p>
					</div>
					<div className="row g-4 justify-content-center">
						<div className="col-md-5">
							<div className="card h-100 border-0 shadow-sm p-4 text-center" style={{ borderRadius: "25px", backgroundColor: "#ebf2f1" }}>
								<i className="fas fa-calendar-plus fa-3x mb-3" style={{ color: "#e8888c" }}></i>
								<h4 className="fw-bold" style={{ color: "#566873" }}>Nueva Solicitud</h4>
								<button className="btn btn-lg w-100 text-white fw-bold mt-3" style={{ backgroundColor: "#e8888c", borderRadius: "15px" }} data-bs-toggle="modal" data-bs-target="#citaRapidaModal">
									Pedir Cita ahora
								</button>
							</div>
						</div>

						<div className="col-md-5">
							<div className="card h-100 border-0 shadow-lg p-4 text-center" style={{ borderRadius: "25px", border: "2px solid #93bbbf" }}>
								<i className="fas fa-user-check fa-3x mb-3" style={{ color: "#93bbbf" }}></i>
								<h4 className="fw-bold" style={{ color: "#566873" }}>Consultar mi Cita</h4>
								<form onSubmit={irAMisCitas} className="input-group mt-3">
									<input type="text" className="form-control border-0 bg-light" placeholder="DNI / NIE" style={{ borderRadius: "12px 0 0 12px" }} value={dniBusqueda} onChange={(e) => setDniBusqueda(e.target.value)} required />
									<button type="submit" className="btn px-4 text-white fw-bold" style={{ backgroundColor: "#93bbbf", borderRadius: "0 12px 12px 0" }}>Ver</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section id="servicios" className="py-5" style={{ backgroundColor: "#ebf2f1" }}>
				<div className="container">
					<div className="text-center mb-5">
						<h2 style={{ color: "#566873" }}>Servicios Destacados</h2>
						<div style={{ width: "60px", height: "4px", backgroundColor: "#e8888c", margin: "10px auto" }}></div>
					</div>
					<div className="row g-4">
						{[
							{ title: "Agenda Médica", icon: "fa-calendar-alt", desc: "Optimiza los tiempos de consulta." },
							{ title: "Historial Clínico", icon: "fa-notes-medical", desc: "Toda la información del paciente segura." },
							{ title: "Descarga PDF", icon: "fa-file-pdf", desc: "Informes listos para el paciente al instante." }
						].map((item, idx) => (
							<div key={idx} className="col-md-4">
								<div className="service-card p-4 text-center border-0 shadow-sm rounded-4 h-100" style={{ backgroundColor: "#ffffff" }}>
									<i className={`fas ${item.icon} fa-3x mb-3`} style={{ color: "#5e888c" }}></i>
									<h4 style={{ color: "#566873" }}>{item.title}</h4>
									<p style={{ color: "#566873" }}>{item.desc}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<div className="modal fade" id="nosotrosModal" tabIndex="-1" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered modal-xl">
					<div className="modal-content border-0 shadow-lg overflow-hidden"
						style={{ borderRadius: "30px", backgroundColor: "#ffffff", opacity: "1" }}>

						<div className="row g-0">
							<div className="col-lg-5 d-none d-lg-flex align-items-center justify-content-center"
								style={{ backgroundColor: "#ebf2f1", minHeight: "500px" }}>

								<div className="text-center p-5">
									<div className="p-4 rounded-4 shadow-sm bg-white border border-light">
										<img
											src="/IconoGecap.png"
											alt="GECAP Logo"
											className="img-fluid"
											style={{ width: "200px" }}
										/>
									</div>
									<p className="mt-4"
										style={{
											fontFamily: "'Indie Flower', cursive",
											color: "var(--gecap-action)",
											fontSize: "1.4rem",
											transform: "rotate(-2deg)"
										}}>
										Tu centro bajo control
									</p>
								</div>
							</div>

							<div className="col-lg-7 position-relative bg-white">

								<div className="text-end p-4">
									<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
								</div>

								<div className="p-5 pt-0">
									<h2 className="display-5 fw-bold mb-3" style={{ color: "#566873" }}>Sobre Nosotros</h2>
									<div className="mb-4" style={{ width: "80px", height: "5px", backgroundColor: "#e8888c" }}></div>

									<p className="fs-5 mb-4" style={{ color: "#566873", lineHeight: "1.6" }}>
										Somos la plataforma de <strong>GESTION SANITARIA INTEGRAL</strong> diseñada para conectar el servicio médico, con las necesidades del paciente, a tan sólo un click simplificando los procesos de gestión y solicitud de consultas.
										Creemos en una salud digital sin barreras, donde la tecnología trabaje para las personas.
									</p>

									<div className="row g-4 mt-2">
										<div className="col-md-6">
											<div className="p-3 rounded-4 bg-light shadow-sm border-start border-4" style={{ borderColor: "#5e888c" }}>
												<h6 className="fw-bold mb-1" style={{ color: "#5e888c" }}>Tecnología Integrada</h6>
												<p className="small mb-0 text-muted">Arquitectura robusta y escalable para datos sensibles.</p>
											</div>
										</div>
										<div className="col-md-6">
											<div className="p-3 rounded-4 bg-light shadow-sm border-start border-4" style={{ borderColor: "#e8888c" }}>
												<h6 className="fw-bold mb-1" style={{ color: "#e8888c" }}>Cuidado Humano</h6>
												<p className="small mb-0 text-muted">Diseño centrado en la facilidad de uso para el paciente.</p>
											</div>
										</div>
									</div>

									<div className="mt-5 text-end">
										<button type="button" className="btn btn-lg px-5 shadow-sm fw-bold"
											style={{ backgroundColor: "#566873", color: "white", borderRadius: "12px" }}
											data-bs-dismiss="modal">
											Cerrar
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="modal fade" id="citaRapidaModal" key="modal-cita-unica" tabIndex="-1" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content border-0 shadow-lg" style={{ borderRadius: "20px" }}>
						<div className="modal-header border-0 pt-4 px-4">
							<h5 className="fw-bold" style={{ color: "#566873" }}>Solicitar Cita Médica</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal"></button>
						</div>
						<div className="modal-body p-4">
							<p className="small text-muted mb-4">Completa tus datos y el profesional se pondrá en contacto contigo.</p>
							<form onSubmit={manejarEnvioCita}>
								<div className="mb-3">
									<label className="form-label small fw-bold text-muted">NOMBRE COMPLETO</label>
									<input
										type="text"
										className="form-control bg-light border-0"
										placeholder="Ej: Ana García"
										style={{ borderRadius: "10px" }}
										value={solicitud.nombre}
										onChange={(e) => setSolicitud({ ...solicitud, nombre: e.target.value })}
										required
									/>
								</div>

								{/* --- AÑADIR ESTE BLOQUE --- */}
								<div className="mb-3">
									<label className="form-label small fw-bold text-muted">DNI / NIE</label>
									<input
										type="text"
										className="form-control bg-light border-0"
										placeholder="Ej: 12345678Z"
										style={{ borderRadius: "10px" }}
										value={solicitud.dni}
										onChange={(e) => setSolicitud({ ...solicitud, dni: e.target.value.toUpperCase() })}
										required
									/>
								</div>
								{/* -------------------------- */}

								<div className="mb-3">
									<label className="form-label small fw-bold text-muted">TELÉFONO DE CONTACTO</label>
									<input
										type="tel"
										className="form-control bg-light border-0"
										placeholder="Ej: 600 000 000"
										style={{ borderRadius: "10px" }}
										value={solicitud.telefono}
										onChange={(e) => setSolicitud({ ...solicitud, telefono: e.target.value })}
										required
									/>
								</div>

								<div className="mb-3">
									<label className="form-label small fw-bold text-muted">MOTIVO DE CONSULTA</label>
									<select
										className="form-select bg-light border-0"
										style={{ borderRadius: "10px" }}
										value={solicitud.motivo}
										onChange={(e) => setSolicitud({ ...solicitud, motivo: e.target.value })}
									>
										<option value="Control Rutinario">Control Rutinario</option>
										<option value="Urgencia">Urgencia</option>
										<option value="Seguimiento">Seguimiento</option>
										<option value="Otros">Otros</option>
									</select>
								</div>
								<button type="submit" className="btn w-100 mt-3 fw-bold text-white shadow-sm py-2" style={{ backgroundColor: "#e8888c", borderRadius: "12px" }}>
									Enviar Solicitud
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};