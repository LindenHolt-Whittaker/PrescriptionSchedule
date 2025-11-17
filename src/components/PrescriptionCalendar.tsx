import { type PrescriptionData } from "../types/prescriptionData";
import { generateSchedule } from "../utils/prescriptionSchedule";
import "./PrescriptionCalendar.scss";

interface PrescriptionCalendarProps {
  scheduleData: PrescriptionData;
}

const PrescriptionCalendar = ({ scheduleData }: PrescriptionCalendarProps) => {
  const schedule = generateSchedule(scheduleData);

  return (
    <div className="PrescriptionCalendar">
      <h2>Prescription Schedule</h2>
      <div className="PrescriptionCalendar__grid">
        {schedule.map((day) => (
          <div
            key={day.date.toISOString()}
            className={`PrescriptionCalendar__day ${
              day.isPickupDay ? "PrescriptionCalendar__day--pickup" : ""
            }`}
          >
            <div className="PrescriptionCalendar__dayNumber">
              {day.date.toLocaleDateString("en-GB", {
                weekday: "narrow",
                year: "2-digit",
                month: "2-digit",
                day: "numeric",
              })}
            </div>
            <div className="PrescriptionCalendar__dosage">{day.dosage}mg</div>
            <div
              className={
                day.isPickupDay
                  ? "PrescriptionCalendar__pickupText"
                  : "PrescriptionCalendar__pickupText--empty"
              }
            >
              Pickup
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrescriptionCalendar;
