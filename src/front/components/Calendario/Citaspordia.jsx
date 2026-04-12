import React, { useState, useEffect } from "react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";


const Scheduler = ({ fechaSeleccionada, onAgregarPaciente, onEliminarPaciente }) => {

    const [calendar, setCalendar] = useState(null);
    const [misCitas, setMisCitas] = useState([]);

    useEffect(() => {
        if (!calendar || calendar.disposed())
            return;

        calendar.update({
            startDate: new DayPilot.Date(fechaSeleccionada),
            events: misCitas,

        });
    }, [calendar, fechaSeleccionada, misCitas]);

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

            setMisCitas(prev => [...prev, nuevaCita]);

            onAgregarPaciente({
                id: nuevaCita.id,
                hora: new Date(args.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                nombre: modal.result,
                motivo: "Consulta"
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
                    fontColor: "#fff",
                    text: "X",
                    style: "cursor:pointer; background-color: rgba(0,0,0,0.2); border-radius: 50%; text-align: center; line-height: 18px;",
                    onClick: (argsArea) => {
                        const elimina = argsArea.source;
                        const id = elimina.id();

                        setMisCitas(prev =>
                            prev.filter(cita => cita.id !== id)
                        );

                        onEliminarPaciente(id);
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

export default Scheduler;
