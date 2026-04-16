import React, { createContext } from "react";

export const Context = createContext(null);

export const initialStore = () => {
  return {
    pacientes: [],
    pacienteActual: null,
    message: null,
    paciente: {
      nombre: "",
      apellidos: "",
      email: "",
      telefono: "",
      nacimiento: "",
      edad: "--",
      direccion: "",
      ciudad: "",
      pais: "",
      cp: "",
      peso: "",
      altura: "",
      imc_ideal: "",
      tension: "",
      frecuencia: "",
      alergia_penicilina: "NO",
      alergia_terramicina: "NO",
      alergia_anestesia: "NO",
      alergia_latex: "NO",
      alergia_aines: "NO",
      alergia_otros: "",
      observaciones: "",
      antecedentes: "",
      anotaciones: "",
    },
    todos: [
      { id: 1, title: "Make the bed", background: null },
      { id: 2, title: "Do my homework", background: null },
    ],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    
    case "login_user":
      return {
        ...store,
        token: action.payload.token,
        user: action.payload.user,
        role: action.payload.role, 
      };

    case "set_patients":
      return {
        ...store,
        pacientes: action.payload,
      };

    case "save_patient":
      return {
        ...store,
        pacientes: [...(store.pacientes || []), action.payload],
        pacienteActual: action.payload,
      };

    case "select_patient":
      return {
        ...store,
        pacienteActual: action.payload,
      };
  
    case "clear_patient":
      return {
        ...store,
        pacienteActual: null,
      };

    case "delete_patient":
      return {
        ...store,       
        pacientes: store.pacientes.filter(p => p.id !== action.payload),        
        pacienteActual: store.pacienteActual?.id === action.payload ? null : store.pacienteActual
      };

    default:
      return store;
  }
   
}
