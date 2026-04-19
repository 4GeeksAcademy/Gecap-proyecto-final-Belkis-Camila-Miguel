import React, { useState, useEffect } from "react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";


const CitasPorDia = ({ fechaSeleccionada, onAgregarCita, onEliminarCita, pacientesHoy, onActualizarCita }) => {

    const [calendar, setCalendar] = useState(null);
    const [misCitas, setMisCitas] = useState([]);

    useEffect(() => {
        if (!calendar || calendar.disposed())
            return;

        calendar.update({
            startDate: new DayPilot.Date(fechaSeleccionada),
            events: pacientesHoy.map(p=>({ 
                id: p.id,
                text: p.patient_name,
                start: p.start,
                end: p.end,

              })),

        });
    }, [calendar, fechaSeleccionada, pacientesHoy]);


    const handleGuardarCita = () => {
        // Validaciones
        if (!formData.nombre.trim()) {
            alert("El nombre es obligatorio");
            return;
        }

        if (formData.telefono.length !== 9) {
            alert("El teléfono debe tener 9 números");
            return;
        }
        const motivoFinal =
            formData.motivo === "Otro"
                ? formData.otroMotivo
                : formData.motivo;

        if (!motivoFinal.trim()) {
            alert("El motivo de consulta es obligatorio");
            return;
        }
    

        const nuevaCita = {
            id: DayPilot.guid(),
            text: `${formData.nombre} - ${motivoFinal}`,
            start: selectedRange.start,
            end: selectedRange.end,
            backColor: "#93c47d",
        };

        setMisCitas(prev => [...prev, nuevaCita]);

        onAgregarPaciente({
            id: nuevaCita.id,
            hora: new Date(selectedRange.start).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            }),
            nombre: formData.nombre,
            motivo: motivoFinal,
            telefono: formData.telefono,
            start: selectedRange.start,
            end: selectedRange.end
        });

        setShowModal(false);

        setFormData({
            nombre: "",
            telefono: "",
            motivo: ""
        });

        if (calendar) {
            calendar.clearSelection();
        }
    };

    const config = {
        viewType: "Day",
        headerDateFormat: "dd/MM/yyyy",
        columns: [{ name: "Agenda Médica", id: "C1" }],
        dayBeginsHour: 10,
        dayEndsHour: 21,
        businessBeginsHour: 10,
        businessEndsHour: 21,
        heightSpec: "BusinessHoursNoScroll",
        headerHeight: 50,
        cellHeight: 40,
        theme: "calendar_default",
        durationBarVisible: false,

        onTimeRangeSelected: async (args) => {
            const modal = await DayPilot.Modal.prompt("Nueva cita", "Nombre y apellido");
            calendar.clearSelection();
            if (modal.canceled || !modal.result) return;

            const nuevaCita = {
                id: DayPilot.guid(),
                text: modal.result,
                start: args.start,
                end: args.end,
            };

            setMisCitas(prev => [...prev, nuevaCita]);


            

            onAgregarPaciente({
                id: nuevaCita.id,
                hora: new Date(args.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                nombre: modal.result,
                motivo: "Consulta",
                start: args.start,
                end: args.end
                
            });
            
        },

        onBeforeEventRender: args => {
             if (!args.data.backColor) {
                args.data.backColor = "#93c47d";
            }

            args.data.borderColor = "darker";
            args.data.fontColor = "white";
            args.data.areas = [
                {
                    right: 5,
                    top: 8,
                    width: 18,
                    height: 18,
                    text: "X",
                    style: "cursor:pointer; background-color: rgba(0,0,0,0.2); border-radius: 50%; text-align: center; line-height: 18px;",
                    onClick: (argsArea) => {
                        onEliminarCita(argsArea.source.id());
                    }
                },
                {
                    right: 28,
                    top: 8,
                    width: 18,
                    height: 18,
                    text: "✎",
                    style: "cursor:pointer; background-color: rgba(0,0,0,0.2); border-radius: 50%; text-align: center; line-height: 18px;",
                    onClick: async (argsArea) => {
                        const citaActual = argsArea.source.data;
                        const modal = await DayPilot.Modal.prompt("Editar nombre:", citaActual.text);
                        console.log (modal.result)
                        if (modal.canceled || !modal.result) return;

                        onActualizarCita(citaActual.id, {
                            nombre: modal.result, 
                            start: citaActual.start.toString(),
                            end: citaActual.end.toString(),
                            reason: "Consulta",
                            status:"Active",
                            date: new Date(citaActual.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),

                        });
                    }
                }
            ];
        }
    };


return (
    <div className="mt-3 border rounded shadow-sm overflow-hidden">
        <DayPilotCalendar {...config} controlRef={setCalendar} />
    </div>

);
};

export default CitasPorDia;