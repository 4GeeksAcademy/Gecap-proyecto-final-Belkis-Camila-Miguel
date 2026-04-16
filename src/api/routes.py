"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Doctor, Patient, Appointment
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
import re

bcrypt = Bcrypt()

api = Blueprint('api', __name__)

CORS(api, resources={r"/*": {"origins": "*"}})

@api.route('/appointments', methods=['POST'])
@jwt_required()
def create_appointment():
    data = request.get_json()
    user_id = get_jwt_identity() 
   
    doctor = Doctor.query.filter_by(user_id=user_id).first()
    
    if not doctor:
        return jsonify({"msg": "Perfil de médico no encontrado"}), 404

    try:
        new_app = Appointment(
            patient_id=data.get("patient_id"),
            doctor_id=doctor.doctor_id, 
            date=data.get("date"),
            time=data.get("time"),
            reason=data.get("reason"),
            status="pendiente"
        )
        db.session.add(new_app)
        db.session.commit()
        return jsonify({"msg": "Cita agendada correctamente", "appointment": new_app.serialize()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al crear la cita", "error": str(e)}), 500

@api.route('/appointments', methods=['GET'])
@jwt_required()
def get_my_appointments():
    user_id = get_jwt_identity() 
    doctor = Doctor.query.filter_by(user_id=user_id).first()
    
    if not doctor:
        return jsonify({"msg": "Médico no encontrado"}), 404

    appointments = Appointment.query.filter_by(doctor_id=doctor.doctor_id).all()
    return jsonify([a.serialize() for a in appointments]), 200


@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    nombre = data.get("nombre")
    role = data.get("role")
    
    user_exists = User.query.filter_by(email=email).first()
    if user_exists:
        return jsonify({"msg": "El correo electrónico ya está registrado"}), 400

    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    try:
        new_user = User(email=email, password=pw_hash,
                        role=role, is_active=True)
        db.session.add(new_user)
        db.session.flush()

        if role == "medico":            
            new_profile = Doctor(doctor_name=nombre, user_id=new_user.id)
        else:
            new_profile = Patient(nombre=nombre, user_id=new_user.id)

        db.session.add(new_profile)
        db.session.commit()

        return jsonify({"msg": f"Registro de {role} exitoso"}), 201

    except Exception as e:
        db.session.rollback()       
        print(f"Error en el registro: {str(e)}") 
        return jsonify({"msg": "Error al procesar el registro", "error": str(e)}), 500


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user_identity = User.query.filter_by(email=email).first()

    if not user_identity:
        return jsonify({"msg": "Email o contraseña incorrectos"}), 401

    if bcrypt.check_password_hash(user_identity.password, password):
        role = user_identity.role

        if role == "medico":
            perfil = Doctor.query.filter_by(user_id=user_identity.id).first()
            user_data = perfil.serialize() if perfil else {
                "doctor_name": "Médico"}
        else:
            perfil = Patient.query.filter_by(user_id=user_identity.id).first()
            user_data = perfil.serialize() if perfil else {
                "patient_name": "Paciente"}

        access_token = create_access_token(identity=str(user_identity.id), additional_claims={"role": role})

        return jsonify({
            "token": access_token,
            "user": user_data,
            "role": role
        }), 200

    return jsonify({"msg": "Email o contraseña incorrectos"}), 401

@api.route('/perfil', methods=['GET'])
@jwt_required()
def get_user_profile():

    current_user_email = get_jwt_identity()

    user = Doctor.query.filter_by(email=current_user_email).first()
    role = "medico"

    if not user:
        user = Patient.query.filter_by(email=current_user_email).first()
        role = "paciente"

    return jsonify({"msg": f"Hola {current_user_email}, tu rol es {role}"}), 200

@api.route('/pacientes', methods=['GET'])
@jwt_required()
def get_pacientes():
    pacientes = Patient.query.all()
    return jsonify([p.serialize() for p in pacientes]), 200

# CREAR PACIENTE
@api.route('/pacientes', methods=['POST'])
@jwt_required()
def create_patient():
    data = request.get_json()
    existing_patient = Patient.query.filter_by(dni=data.get("dni")).first()
    if existing_patient:
        return jsonify({"msg": "El DNI introducido ya pertenece a un paciente registrado"}), 400
    
    try:

        def clean_num(val):
            if val is None or str(val).strip() == "" or str(val) == "--":
                return None
            try: return float(val)
            except: return None

        nuevo_p = Patient(
            nombre=data.get("nombre"),
            apellidos=data.get("apellidos"),
            dni=data.get("dni"),
            email=data.get("email"),
            telefono=data.get("telefono"),
            nacimiento=data.get("nacimiento") if data.get("nacimiento") else None,           
            peso=clean_num(data.get("peso")),
            altura=clean_num(data.get("altura")),
            glucosa=clean_num(data.get("glucosa")),
            spo2=clean_num(data.get("spo2")),
            tension=data.get("tension") or "",
            grupo_sanguineo=data.get("grupoSanguineo") or "",          
            embarazo=data.get("embarazo", "NO"),
            hepatitis=data.get("hepatitis", "NO"),
            tuberculosis=data.get("tuberculosis", "NO"),
            vih=data.get("vih", "NO"),
            radiacion_cabeza=data.get("radiacion_cabeza", "NO"),
            cancer=data.get("cancer", "NO"),
            alergia_penicilina=data.get("alergia_penicilina", "NO"),
            alergia_terramicina=data.get("alergia_terramicina", "NO"),
            alergia_anestesia=data.get("alergia_anestesia", "NO"),
            alergia_latex=data.get("alergia_latex", "NO"),
            alergia_aines=data.get("alergia_aines", "NO"),
            alergia_otros=data.get("alergia_otros", ""),
            anotaciones=data.get("anotaciones", "")
        )
        db.session.add(nuevo_p)
        db.session.commit()
        return jsonify({"msg": "Paciente creado", "id": nuevo_p.patient_id}), 201
    except Exception as e:
        db.session.rollback()
        print(f"🛑 ERROR REAL: {str(e)}")
        return jsonify({"msg": "Error al crear", "error": str(e)}), 500

# ACTUALIZAR PACIENTE (PUT)
@api.route('/pacientes/<int:id>', methods=['PUT'])
@jwt_required()
def update_patient(id):
    paciente = Patient.query.get(id)
    if not paciente: return jsonify({"msg": "No encontrado"}), 404
    
    data = request.get_json()   
    for key, value in data.items():
        if hasattr(paciente, key):
            setattr(paciente, key, value)
    
    db.session.commit()
    return jsonify({"msg": "Paciente actualizado"}), 200

# BORRAR PACIENTE (DELETE)
@api.route('/pacientes/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_patient(id):
    paciente = Patient.query.get(id)
    if not paciente:
        return jsonify({"msg": "Paciente no encontrado"}), 404
    
    try:
        db.session.delete(paciente)
        db.session.commit()
        return jsonify({"msg": "Paciente eliminado correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al eliminar", "error": str(e)}), 500