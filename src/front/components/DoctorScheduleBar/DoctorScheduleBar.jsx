import "./DoctorScheduleBar.css";

function DoctorScheduleBar() {
  const workStart = 8;
  const workEnd = 16;
  const totalHours = workEnd - workStart;

  const appointments = [
    { id: 1, title: "Consulta general", start: 9, end: 9.5 },
    { id: 2, title: "Pediatría", start: 11, end: 11.5 },
    { id: 3, title: "Odontología", start: 15, end: 15.75 }
  ];

  const now = new Date();
  const currentTime = now.getHours() + now.getMinutes() / 60;

  let progress = ((currentTime - workStart) / totalHours) * 100;

  if (progress < 0) progress = 0;
  if (progress > 100) progress = 100;

  const nextAppointment = appointments.find(
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

            {appointments.map((appointment) => {
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
                  title={appointment.title}
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