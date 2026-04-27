import React from "react";

const Cloudinary = ({ onImageUpload, imageUrl }) => {
    const abrirWidget = () => {
        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
                uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
                sources: ["local", "url", "camera"],
                multiple: false,
                resourceType: "image",
            },
            (error, result) => {
                if (!error && result && result.event === "success") {
                    onImageUpload(result.info.secure_url);
                }
            }
        );

        widget.open();
    };

    const eliminarImagen = () => {
        onImageUpload("");
    };

    return (
        <div className="d-flex flex-column align-items-center">
            <div
                style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    backgroundColor: "#f1f5f6",
                    border: "2px solid #93bbbf",
                    marginBottom: "8px"
                }}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="Paciente"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                        }}
                    />
                ) : (
                    <div
                        className="d-flex justify-content-center align-items-center h-100"
                    >
                        <i className="fas fa-user" style={{ fontSize: "2rem", color: "#93bbbf" }}></i>
                    </div>
                )}
            </div>

        
            <div className="d-flex flex-column align-items-center gap-1">

                <button
                    type="button"
                    onClick={abrirWidget}
                    className="btn btn-sm text-white"
                    style={{
                        backgroundColor: "#93bbbf",
                        borderRadius: "20px",
                        padding: "2px 8px",
                        fontSize: "0.65rem"
                    }}
                >
                    <i className="fas fa-camera me-1"></i>
                    {imageUrl ? "Cambiar" : "Subir foto"}
                </button>

                {imageUrl && (
                    <button
                        type="button"
                        onClick={eliminarImagen}
                        className="btn btn-sm btn-outline-danger"
                        style={{
                            borderRadius: "20px",
                            padding: "2px 8px",
                            fontSize: "0.65rem"
                        }}
                    >
                        <i className="fas fa-trash me-1"></i>
                        Quitar
                    </button>
                )}

            </div>

        </div>
    );
};

export default Cloudinary;