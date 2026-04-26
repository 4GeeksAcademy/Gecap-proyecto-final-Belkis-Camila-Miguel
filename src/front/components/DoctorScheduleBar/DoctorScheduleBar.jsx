import React, { useState, useEffect } from 'react';
import "./DoctorScheduleBar.css";

function DoctorScheduleBar({ appointments }) {
  const workStart = 8;
  const workEnd = 20;
  const totalHours = workEnd - workStart;

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const currentTime = now.getHours() + now.getMinutes() / 60;

  const appointmentsBar = (appointments || []).map((app) => {
    let start, end;
    if (app.start && app.end) {
      const startDate = new Date(app.start);
      const endDate = new Date(app.end);
      start = startDate.getHours() + startDate.getMinutes() / 60;
      end = endDate.getHours() + endDate.getMinutes() / 60;
    } else {
      const [hours, minutes] = (app.hora || "00:00").split(":").map(Number);
      start = hours + (minutes || 0) / 60;
      end = start + 0.5;
    }
    return { ...app, start, end };
  });

  const currentApp = appointmentsBar.find(a => currentTime >= a.start && currentTime < a.end);
  const nextApp = appointmentsBar.find(a => a.start > currentTime);

  let progress = 0;
  let minutesLeft = null;

  if (currentApp) {

    const duration = currentApp.end - currentApp.start;
    const elapsed = currentTime - currentApp.start;
    progress = (elapsed / duration) * 100;
    minutesLeft = Math.round((currentApp.end - currentTime) * 60);
  } else {
    progress = 0;
    if (nextApp) minutesLeft = Math.round((nextApp.start - currentTime) * 60);
  }

  progress = Math.max(0, Math.min(100, progress));

  const getCounterClass = () => {
    if (minutesLeft === null) return "counter-neutral";
    if (currentApp) {
      return progress > 80 ? "counter-alert" : "counter-safe";
    }
    return minutesLeft <= 15 ? "counter-warning" : "counter-safe";
  };

  return (
    <div className="doctor-schedule-widget">
      <div className="doctor-schedule-row">
        <div className="schedule-bar-wrapper">
          <div className={`schedule-bar ${currentApp && progress >= 100 ? "blink-animation" : ""}`}
            style={{ backgroundColor: "#e9ecef", overflow: "hidden" }}>

            <div
              className="schedule-progress-fill"
              style={{
                width: `${progress}%`,
                backgroundColor: progress >= 100 ? "#dc3545" : (progress > 80 ? "#e8888c" : "#93bbbf"),
                transition: "width 0.5s ease-in-out"
              }}
            ></div>

            {appointmentsBar.map((app) => {
              const left = ((app.start - workStart) / totalHours) * 100;
              const width = ((app.end - app.start) / totalHours) * 100;
              return (
                <div
                  key={app.id}
                  className="appointment-segment-bg"
                  style={{
                    left: `${left}%`,
                    width: `${width}%`,
                    position: "absolute",
                    height: "100%",
                    borderRight: "1px solid rgba(255,255,255,0.3)",
                    backgroundColor: "rgba(0,0,0,0.05)"
                  }}
                ></div>
              );
            })}

            <div className="progress-text" style={{ color: progress > 50 ? "white" : "#566873" }}>
              {currentApp ? (progress >= 100 ? "TIEMPO AGOTADO" : `${Math.round(progress)}%`) : "Libre"}
            </div>
          </div>
        </div>

        <div className={`time-counter ${getCounterClass()}`}>
          {minutesLeft !== null ? `${minutesLeft} min` : "---"}
        </div>
      </div>

      <div className="next-appointment-text">
        {currentApp
          ? `Paciente actual: ${currentApp.nombre || currentApp.user_name}`
          : (nextApp
            ? `Siguiente: ${nextApp.nombre || nextApp.user_name} (en ${minutesLeft} min)`
            : "Jornada finalizada")}
      </div>
    </div>
  );
}

export default DoctorScheduleBar;