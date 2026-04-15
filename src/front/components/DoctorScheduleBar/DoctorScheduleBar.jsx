import "./DoctorScheduleBar.css";

function DoctorScheduleBar({ appointments }) {
  const workStart = 8;
  const workEnd = 24;
  const totalHours = workEnd - workStart;


  const now = new Date();
  const currentTime = now.getHours() + now.getMinutes() / 60;

  const appointmentsBar = appointments.map((appointment) => {
    let start, end;

    if (appointment.start && appointment.end) {
      const startDate = new Date(appointment.start);
      const endDate = new Date(appointment.end);

      start = startDate.getHours() + startDate.getMinutes() / 60;
      end = endDate.getHours() + endDate.getMinutes() / 60;
    } else {
      const [hours, minutes] = appointment.hora.split(":").map(Number);
      start = hours + minutes / 60;
      end = start + 0.5;
    }

    return {
      id: appointment.id,
      title: appointment.motivo || "Consulta",
      patientName: appointment.nombre,
      start,
      end
    };
  })

  let progress = ((currentTime - workStart) / totalHours) * 100;

  if (progress < 0) progress = 0;
  if (progress > 100) progress = 100;

  const nextAppointment = appointmentsBar.find(
    (appointment) => appointment.start > currentTime
  );

  let minutesLeft = null;

  if (nextAppointment) {
    const hoursLeft = nextAppointment.start - currentTime;
    minutesLeft = Math.round(hoursLeft * 60);
  }

  const getCounterClass = () => {
    if (minutesLeft === null) return "counter-neutral";
    if (minutesLeft > 45) return "counter-safe";
    if (minutesLeft > 15) return "counter-warning";
    return "counter-alert";
  };

  return (
    <div className="doctor-schedule-widget">
      <div className="doctor-schedule-row">
        <div className="schedule-bar-wrapper">
          <div className="schedule-bar">
            <div
              className="schedule-progress-fill"
              style={{ width: `${progress}%` }}
            ></div>

            <div
              className="current-time-indicator"
              style={{ left: `${progress}%` }}
            ></div>

            <div className="progress-text">
              {Math.round(progress)}%
            </div>

            {appointmentsBar.map((appointment) => {
              const hoursFromStart = appointment.start - workStart;
              const duration = appointment.end - appointment.start;

              const left = (hoursFromStart / totalHours) * 100;
              const width = (duration / totalHours) * 100;

              const isNext =
                nextAppointment && appointment.id === nextAppointment.id;

              return (
                <div
                  key={appointment.id}
                  className={`appointment-segment ${
                    isNext ? "next-segment" : "normal-segment"
                  }`}
                  style={{
                    left: `${left}%`,
                    width: `${width}%`
                  }}
                  title={`${appointment.title} - ${appointment.patientName}`}
                ></div>
              );
            })}
          </div>
        </div>

        <div className={`time-counter ${getCounterClass()}`}>
          {minutesLeft !== null ? `${minutesLeft} min` : "Sin citas"}
        </div>
      </div>

      <div className="next-appointment-text">
        {nextAppointment
          ? `Próxima consulta: ${nextAppointment.title}`
          : "No hay más consultas por hoy"}
      </div>
    </div>
  );
}

export default DoctorScheduleBar;