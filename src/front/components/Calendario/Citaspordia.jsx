import React, { useState, useEffect } from "react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";


const CitasPorDia = ({ fechaSeleccionada, onAgregarCita, onEliminarCita, pacientesHoy, onActualizarCita }) => {

    const [calendar, setCalendar] = useState(null);

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

    const config = {
        viewType: "Day",
        headerDateFormat: "dd/MM/yyyy",
        columns: [{ name: "Agenda Médica", id: "C1" }],
        dayBeginsHour: 10,
        dayEndsHour: 21,
        businessBeginsHour: 10,
        businessEndsHour: 21,
        heightSpec: "BusinessHoursNoScroll",
        headerHeight: 40,
        cellHeight: 30,
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

            onAgregarCita({
                patient_id: nuevaCita.id,
                date: new Date(args.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                nombre: modal.result,
                reason: "Consulta",
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