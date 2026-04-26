from flask import Flask, request, jsonify, url_for, Blueprint, current_app
from api.models import db, User, Patient, Appointment, Message
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt


bcrypt = Bcrypt()

api = Blueprint('api', __name__)

CORS(api, resources={r"/*": {"origins": "*"}})

@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    nombre = data.get("nombre")
    role = data.get("role")

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "El correo electrónico ya está registrado"}), 400

    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    try:
        
        new_user = User(
            email=email, 
            password=pw_hash,
            user_name=nombre, 
            role=role, 
            is_active=True
        )
        db.session.add(new_user)
                
        if role != "medico":
            new_profile = Patient(
                nombre=data.get("nombre"),
                apellidos=data.get("apellidos"),
                user_id=new_user.id, 
                dni=data.get("dni")
            )
            db.session.add(new_profile)
            db.session.flush()
        
        db.session.commit()

        token = create_access_token(identity=str(new_user.id), additional_claims={"role": role})
        
        user_data = new_user.serialize() if role == "medico" else new_profile.serialize()

        return jsonify({
            "token": token,
            "role": role,
            "user": user_data
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error en el registro", "error": str(e)}), 500

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get("email")).first()

    if user and bcrypt.check_password_hash(user.password, data.get("password")):
        
        if user.role == "medico":
            user_data = user.serialize()
        else:           
            perfil = Patient.query.filter_by(user_id=user.id).first()
            user_data = perfil.serialize() if perfil else {"nombre": "Paciente"}

        token = create_access_token(
            identity=str(user.id), 
            additional_claims={"role": user.role}
        )

        return jsonify({
            "token": token,
            "role": user.role,
            "user": user_data
        }), 200

    return jsonify({"msg": "Email o contraseña incorrectos"}), 401


@api.route('/perfil', methods=['GET'])
@jwt_required()
def get_user_profile():
    current_user_id = get_jwt_identity()

    user_base = db.session.get(User, current_user_id)
    if not user_base:
        return jsonify({"msg": "Usuario no encontrado"}), 404
   
    if user_base.role == "medico":
        perfil_data = user_base.serialize()
    else:
        perfil = Patient.query.filter_by(user_id=user_base.id).first()
        perfil_data = perfil.serialize() if perfil else None

    return jsonify({
        "id": user_base.id,
        "email": user_base.email,
        "role": user_base.role,
        "perfil": perfil_data
    }), 200

@api.route('/pacientes', methods=['GET'])
@jwt_required()
def get_pacientes():
    pacientes = Patient.query.all()
    return jsonify([p.serialize() for p in pacientes]), 200

@api.route('/pacientes', methods=['POST'])
@jwt_required()
def create_patient():
    data = request.get_json()

    existing_patient = Patient.query.filter_by(dni=data.get("dni")).first()
    if existing_patient:
        return jsonify({"msg": "El DNI introducido ya pertenece a un paciente registrado"}), 400

    def clean_num(val):
        if val is None or str(val).strip() in ["", "--"]:
            return None
        try:
            return float(val)
        except (ValueError, TypeError):
            return None

    try:
        nuevo_p = Patient(
            nombre=data.get("nombre"),
            apellidos=data.get("apellidos"),
            dni=data.get("dni"),
            email=data.get("email"),
            telefono=data.get("telefono"),
            nacimiento=data.get("nacimiento") or None,
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
        return jsonify({"msg": "Error al crear", "error": str(e)}), 500

@api.route('/pacientes/<int:id>', methods=['PUT'])
@jwt_required()
def update_patient(id):
    paciente = db.session.get(Patient, id)
    if not paciente:
        return jsonify({"msg": "No encontrado"}), 404

    data = request.get_json()
    for key, value in data.items():
        if hasattr(paciente, key):
            setattr(paciente, key, value)

    db.session.commit()
    return jsonify({"msg": "Paciente actualizado"}), 200

@api.route('/pacientes/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_patient(id):
    paciente = db.session.get(Patient, id)
    if not paciente:
        return jsonify({"msg": "Paciente no encontrado"}), 404

    try:
        db.session.delete(paciente)
        db.session.commit()
        return jsonify({"msg": "Paciente eliminado correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al eliminar", "error": str(e)}), 500

@api.route('/appointments', methods=['GET'])
@jwt_required()
def get_all_appointment():
    current_user_id = get_jwt_identity()
    result_all_appointment = db.session.execute(
        select(Appointment).where(Appointment.user_id == current_user_id)).scalars().all()
    return jsonify([appointment.serialize() for appointment in result_all_appointment]), 200


@api.route('/appointment/<int:appointment_id>', methods=['GET'])
@jwt_required()
def get_appointment(appointment_id):
    current_user_id= get_jwt_identity()
    appointment = db.session.execute(
        select(Appointment).where(Appointment.appointment_id == appointment_id, Appointment.user_id == current_user_id)).scalar_one_or_none()
    if appointment is None:
        return jsonify({"msg": "Cita no encontrada"}), 404
    return jsonify(appointment.serialize()), 200


@api.route('/appointment', methods=['POST'])
@jwt_required()
def add_appointment():
    current_user_id= get_jwt_identity()
    data = request.get_json()
    patient = db.session.execute(select(Patient).where(Patient.nombre == "prueba")).scalar_one_or_none()

    if not patient:
        patient = Patient(nombre=data["nombre"])
        db.session.add(patient)
        db.session.commit()

    new_appointment = Appointment(
        patient_id=patient.patient_id,
        date=data["date"],
        start=data["start"],
        end=data["end"],
        status= data["status"],
        reason=data["reason"],
        user_id=current_user_id
    )

    db.session.add(new_appointment)
    db.session.commit()

    return jsonify({
        "message": "Appointment created successfully",
        "appointment": new_appointment.serialize()
    }), 201


@api.route('/appointment/<int:appointment_id>', methods=['PUT'])
@jwt_required()
def update_appointment(appointment_id):
    data = request.get_json()
    current_user_id= get_jwt_identity()
    appointment_actualizate = db.session.execute(
    select(Appointment).where(Appointment.appointment_id == appointment_id, Appointment.user_id == current_user_id)).scalar_one_or_none()
    if not appointment_actualizate:
        return jsonify({"msg": "Cita no encontrada"}), 404


    appointment_actualizate.date = data.get("date")
    appointment_actualizate.status = data.get("status")
    appointment_actualizate.start = data.get("start")
    appointment_actualizate.end = data.get("end")
    appointment_actualizate.reason = data.get("reason")
    appointment_actualizate.patient.nombre= data.get("nombre", appointment_actualizate.patient.nombre)

    db.session.commit()
    return jsonify({"mensaje": f"Usuario {appointment_id} actualizado", "datos":appointment_actualizate.serialize()}), 200


@api.route('/appointment/<int:appointment_id>', methods=['DELETE'])
@jwt_required()
def delete_appointment(appointment_id):
    current_user_id=get_jwt_identity()
    appointment_to_delete = db.session.execute(select(Appointment).where(
        Appointment.appointment_id == appointment_id, Appointment.user_id==current_user_id)).scalar_one_or_none()
    if not appointment_to_delete:
        return jsonify({"msg": "la cita no existe"}), 450

    db.session.delete(appointment_to_delete)
    db.session.commit()
    return jsonify({"msg": "Eliminado con exito"}), 200

@api.route('/external-appointment', methods=['POST'])
def handle_external_appointment():
    data = request.get_json()     
   
    nombre = data.get("nombre")
    dni = data.get("dni")
    telefono = data.get("telefono")
    motivo = data.get("motivo")
    
    if not nombre or not telefono or not dni:
        return jsonify({"msg": "Nombre, DNI y teléfono son requeridos"}), 400

    try:        
        nuevo_mensaje = Message(
            full_name=nombre,
            dni=dni.upper(),
            phone=telefono,
            reason=motivo
        )
        db.session.add(nuevo_mensaje)
        db.session.commit()
        
        return jsonify({"msg": "Mensaje enviado al médico correctamente"}), 201
    except Exception as e:
        db.session.rollback()       
        print(f"Error en el servidor: {str(e)}")
        return jsonify({"msg": "Error al procesar la solicitud", "error": str(e)}), 500
    
@api.route('/messages/<string:dni>', methods=['GET'])
def get_messages_by_dni(dni):    
    messages = Message.query.filter_by(dni=dni.upper()).all()
    
    if not messages:
        return jsonify({"msg": "No se encontraron solicitudes para este DNI"}), 404
       
    return jsonify([m.serialize() for m in messages]), 200

@api.route('/messages', methods=['GET'])
@jwt_required()
def get_all_messages():
    try:        
        messages = Message.query.all()
        return jsonify([m.serialize() for m in messages]), 200
    except Exception as e:
        print(f"Error en /messages: {str(e)}")
        return jsonify({"msg": "Error interno"}), 500
