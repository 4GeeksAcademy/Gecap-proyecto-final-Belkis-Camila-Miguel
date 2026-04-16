from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, Integer, Float, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "user"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(250), nullable=False)
    role: Mapped[str] = mapped_column(String(20))
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True)


class Doctor(db.Model):
    __tablename__ = "doctor"
    doctor_id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    doctor_name: Mapped[str] = mapped_column(String(100), nullable=False)
    appointment: Mapped[List["Appointment"]
                        ] = relationship(back_populates="doctor")

    def serialize(self):
        return {
            "id": self.doctor_id,
            "user_id": self.user_id,
            "nombre": self.doctor_name,
        }


class Patient(db.Model):
    __tablename__ = "patient"
    patient_id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=True)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    apellidos: Mapped[str] = mapped_column(String(100), nullable=False)
    dni: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120))
    telefono: Mapped[str] = mapped_column(String(20))
    nacimiento: Mapped[str] = mapped_column(String(20), nullable=True)

    # Biometría y Constantes
    peso: Mapped[float] = mapped_column(Float, nullable=True)
    altura: Mapped[float] = mapped_column(Float, nullable=True)
    glucosa: Mapped[int] = mapped_column(Integer, nullable=True)
    tension: Mapped[str] = mapped_column(String(20), nullable=True)
    spo2: Mapped[int] = mapped_column(Integer, nullable=True)
    grupo_sanguineo: Mapped[str] = mapped_column(String(10), nullable=True)

    # Riesgos y Bioseguridad (Guardamos "SI" o "NO")
    embarazo: Mapped[str] = mapped_column(String(5), default="NO")
    hepatitis: Mapped[str] = mapped_column(String(5), default="NO")
    tuberculosis: Mapped[str] = mapped_column(String(5), default="NO")
    vih: Mapped[str] = mapped_column(String(5), default="NO")
    radiacion_cabeza: Mapped[str] = mapped_column(String(5), default="NO")
    cancer: Mapped[str] = mapped_column(String(5), default="NO")

    # Alergias
    alergia_penicilina: Mapped[str] = mapped_column(String(5), default="NO")
    alergia_terramicina: Mapped[str] = mapped_column(String(5), default="NO")
    alergia_anestesia: Mapped[str] = mapped_column(String(5), default="NO")
    alergia_latex: Mapped[str] = mapped_column(String(5), default="NO")
    alergia_aines: Mapped[str] = mapped_column(String(5), default="NO")
    alergia_otros: Mapped[str] = mapped_column(Text, nullable=True)

    anotaciones: Mapped[str] = mapped_column(Text, nullable=True)

    appointment: Mapped[List["Appointment"]
                        ] = relationship(back_populates="patient")

    def serialize(self):
        return {
            "id": self.patient_id,
            "nombre": self.nombre,
            "apellidos": self.apellidos,
            "dni": self.dni,
            "email": self.email,
            "telefono": self.telefono,
            "nacimiento": self.nacimiento,
            "peso": self.peso,
            "altura": self.altura,
            "glucosa": self.glucosa,
            "tension": self.tension,
            "spo2": self.spo2,
           "grupoSanguineo": self.grupo_sanguineo,
            "embarazo": self.embarazo,
            "hepatitis": self.hepatitis,
            "tuberculosis": self.tuberculosis,
            "vih": self.vih,
            "radiacion_cabeza": self.radiacion_cabeza,
            "cancer": self.cancer,
            "alergia_penicilina": self.alergia_penicilina,
            "alergia_terramicina": self.alergia_terramicina,
            "alergia_anestesia": self.alergia_anestesia,
            "alergia_latex": self.alergia_latex,
            "alergia_aines": self.alergia_aines,
            "alergia_otros": self.alergia_otros,
            "anotaciones": self.anotaciones
        }

class Appointment(db.Model):
    __tablename__ = "appointment"
    appointment_id: Mapped[int] = mapped_column(primary_key=True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patient.patient_id"), nullable=False)
    doctor_id: Mapped[int] = mapped_column(ForeignKey("doctor.doctor_id"), nullable=False)
    
    # Consejo: Usar String para fecha y hora por separado facilita la vida con los inputs de React
    date: Mapped[str] = mapped_column(String(20), nullable=False) # "2024-05-20"
    time: Mapped[str] = mapped_column(String(10), nullable=False) # "10:30"
    
    reason: Mapped[str] = mapped_column(String(200), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="pendiente")

    doctor: Mapped["Doctor"] = relationship(back_populates="appointment")
    patient: Mapped["Patient"] = relationship(back_populates="appointment")

    def serialize(self):
        return {
            "id": self.appointment_id,
            "patient_id": self.patient_id,
            # Incluimos nombres para que el frontend no tenga que buscarlos
            "patient_name": f"{self.patient.nombre} {self.patient.apellidos}" if self.patient else "Desconocido",
            "doctor_id": self.doctor_id,
            "date": self.date,
            "time": self.time,
            "status": self.status,
            "reason": self.reason
        }