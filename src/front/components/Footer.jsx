import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
	return (
		<footer className="text-white py-5" style={{ backgroundColor: "#566873", borderTop: "4px solid #5e888c" }}>
			<div className="container">
				<div className="row g-4">

					<div className="col-lg-4 col-md-6">
						<div className="d-flex align-items-center mb-3">
							<img src="src/front/assets/img/favicon.png" alt="Logo" width="40" className="me-2" />
							<h4 className="mb-0 fw-bold" style={{ color: "#b4d2d9" }}>GECAP</h4>
						</div>
						<p className="small" style={{ color: "#ebf2f1", opacity: 0.8 }}>
							Soluciones integrales para la gestión sanitaria. Conectando tecnología y salud para un cuidado más cercano.
						</p>
						<div className="d-flex gap-3 mt-3">
							<a href="#" className="fs-4" style={{ color: "#b4d2d9" }}><i className="fab fa-facebook"></i></a>
							<a href="#" className="fs-4" style={{ color: "#b4d2d9" }}><i className="fab fa-instagram"></i></a>
							<a href="#" className="fs-4" style={{ color: "#b4d2d9" }}><i className="fab fa-twitter"></i></a>
							<a href="#" className="fs-4" style={{ color: "#b4d2d9" }}><i className="fab fa-linkedin"></i></a>
						</div>
					</div>

					<div className="col-lg-2 col-md-6">
						<h5 className="mb-3 fw-bold" style={{ color: "#b4d2d9" }}>Enlaces</h5>
						<ul className="list-unstyled">
							<li className="mb-2">
								<Link
									to="/"
									className="text-decoration-none"
									style={{ color: "#ebf2f1" }}
									onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
								>
									Inicio
								</Link>
							</li>
							<li className="mb-2">
								<button
									className="btn btn-link p-0 text-decoration-none border-0"
									style={{ color: "#ebf2f1" }}
									data-bs-toggle="modal"
									data-bs-target="#nosotrosModal">
									Nosotros
								</button>
							</li>
							<li className="mb-2">
								<Link
									to="/servicios"
									className="text-decoration-none"
									style={{ color: "#ebf2f1" }}
									onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
								>
									Servicios
								</Link>
							</li>
							<li className="mb-2">
								<Link
									to="/login"
									className="text-decoration-none"
									style={{ color: "#ebf2f1" }}
									onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
								>
									Acceso Usuarios
								</Link>
							</li>
						</ul>
					</div>

					<div className="col-lg-6 col-md-12">
						<h5 className="mb-3 fw-bold" style={{ color: "#b4d2d9" }}>Nuestra Ubicación</h5>
						<div className="row g-0">
							<div className="col-md-5 mb-3">
								<p className="small mb-1 mt-0"><i className="fas fa-map-marker-alt me-2" style={{ color: "#e8888c" }}></i> Calle Edison, 3</p>
								<p className="small mb-1"><i className="fas fa-phone me-2" style={{ color: "#e8888c" }}></i> +34 900 123 456</p>
								<p className="small"><i className="fas fa-envelope me-2" style={{ color: "#e8888c" }}></i> contacto@gecap.com</p>
							</div>
							<div className="col-md-7">
								<div className="rounded overflow-hidden shadow-sm"
									style={{
										height: "200px",
										marginTop: "-30px"
									}}>
									<iframe
										title="mapa-ubicacion"
										src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3036.598696081065!2d-3.6809783000000005!3d40.4398842!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd422989055a08a7%3A0xb1a742c609c68c4b!2s4Geeks%20Academy%20Espa%C3%B1a!5e0!3m2!1ses!2ses!4v1775670281297!5m2!1ses!2ses"
										width="100%"
										height="100%"
										style={{ border: 0 }}
										allowFullScreen=""
										loading="lazy"
									></iframe>
								</div>
							</div>
						</div>
					</div>
				</div>

				<hr className="mt-5" style={{ backgroundColor: "#93bbbf", opacity: 0.3 }} />
				<div className="text-center mt-3">
					<p className="small mb-0" style={{ color: "#ebf2f1", opacity: 0.6 }}>
						© 2026 GECAP - Proyecto Final Full Stack. Todos los derechos reservados.
					</p>
				</div>
			</div>
		</footer>
	);
};