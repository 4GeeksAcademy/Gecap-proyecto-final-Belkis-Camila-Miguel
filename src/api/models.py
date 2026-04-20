from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, Integer, Float, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "user"   
    id: Mapped[int] = mapped_column(primary_key=True)
    user_name: Mapped[str] = mapped_column(String(30), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(250), nullable=False)
    role: Mapped[str] = mapped_column(String(20), default="medico")
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True)

    appointments: Mapped[List["Appointment"]] = relationship(back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "user_name": self.user_name,
            "email": self.email,
            "role": self.role,
            "is_active": self.is_active
        }

class Patient(db.Model):
    __tablename__ = "patient"
    patient_id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    apellidos: Mapped[str] = mapped_column(String(100), nullable=True)
    dni: Mapped[str] = mapped_column(String(20), unique=True, nullable=True)
    email: Mapped[str] = mapped_column(String(120), nullable=True)
    telefono: Mapped[str] = mapped_column(String(20), nullable=True)
    nacimiento: Mapped[str] = mapped_column(String(20), nullable=True)
    appointments: Mapped[List["Appointment"]] = relationship(back_populates="patient")

    # Biometría y Constantes
    peso: Mapped[float] = mapped_column(Float, nullable=True)
    altura: Mapped[float] = mapped_column(Float, nullable=True)
    glucosa: Mapped[int] = mapped_column(Integer, nullable=True)
    tension: Mapped[str] = mapped_column(String(20), nullable=True)
    spo2: Mapped[int] = mapped_column(Integer, nullable=True)
    grupo_sanguineo: Mapped[str] = mapped_column(String(10), nullable=True)

    # Riesgos y Bioseguridad (Guardamos "SI" o "NO")
    embarazo: Mapped[str] = mapped_column(String(5), default="NO", nullable=True)
    hepatitis: Mapped[str] = mapped_column(String(5), default="NO", nullable=True)
    tuberculosis: Mapped[str] = mapped_column(String(5), default="NO", nullable=True)
    vih: Mapped[str] = mapped_column(String(5), default="NO", nullable=True)
    radiacion_cabeza: Mapped[str] = mapped_column(String(5), default="NO", nullable=True)
    cancer: Mapped[str] = mapped_column(String(5), default="NO", nullable=True)

    # Alergias
    alergia_penicilina: Mapped[str] = mapped_column(String(5), default="NO", nullable=True)
    alergia_terramicina: Mapped[str] = mapped_column(String(5), default="NO", nullable=True)
    alergia_anestesia: Mapped[str] = mapped_column(String(5), default="NO", nullable=True)
    alergia_latex: Mapped[str] = mapped_column(String(5), default="NO", nullable=True)
    alergia_aines: Mapped[str] = mapped_column(String(5), default="NO", nullable=True)
    alergia_otros: Mapped[str] = mapped_column(Text, nullable=True)
    anotaciones: Mapped[str] = mapped_column(Text, nullable=True)

   
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
    patient_id: Mapped[int] = mapped_column(
        ForeignKey("patient.patient_id"), nullable=False)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id"), nullable=False)
    date: Mapped[str] = mapped_column(String(50), nullable=False)
    start: Mapped[str] = mapped_column(String(50), nullable=False)
    end: Mapped[str] = mapped_column(String(50), nullable=False)
    reason: Mapped[str] = mapped_column(String(200), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="pendiente")
    user: Mapped["User"] = relationship(back_populates="appointments")
    patient: Mapped["Patient"] = relationship(back_populates="appointments")

    def serialize(self):
        return {
            "id": self.appointment_id,
            "patient_id": self.patient_id,
            "patient_name": f"{self.patient.nombre} {self.patient.apellidos}" if self.patient else "Desconocido",
            "user_id": self.user_id,
            "date": self.date,
            "start": self.start,
            "end": self.end,
            "status": self.status,
            "reason": self.reason
        }