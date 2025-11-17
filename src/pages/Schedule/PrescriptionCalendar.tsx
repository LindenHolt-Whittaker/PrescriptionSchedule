import { type PrescriptionData } from "../../types/prescriptionData";
import { generateSchedule } from "../../utils/prescriptionSchedule";
import "./PrescriptionCalendar.scss";

interface PrescriptionCalendarProps {
  scheduleData: PrescriptionData;
}

const PrescriptionCalendar = ({ scheduleData }: PrescriptionCalendarProps) => {
  const schedule = generateSchedule(scheduleData);

  return (
    <div className="PrescriptionCalendar">
      <div className="PrescriptionCalendar__grid">
        <div className="PrescriptionCalendar__header">Mon</div>
        <div className="PrescriptionCalendar__header">Tue</div>
        <div className="PrescriptionCalendar__header">Wed</div>
        <div className="PrescriptionCalendar__header">Thu</div>
        <div className="PrescriptionCalendar__header">Fri</div>
        <div className="PrescriptionCalendar__header PrescriptionCalendar__header--weekend">Sat</div>
        <div className="PrescriptionCalendar__header PrescriptionCalendar__header--weekend">Sun</div>

        {/* Add empty divs for offset */}
        {schedule &&
          Array.from({ length: (schedule[0].date.getDay() + 6) % 7 }).map(
            (_, i) => (
              <div
                key={`offset-${i}`}
                className="PrescriptionCalendar__day--empty"
              />
            )
          )}

        {schedule.map((day) => (
          <div
            key={day.date.toISOString()}
            className={`PrescriptionCalendar__day ${
              day.isPickupDay ? "PrescriptionCalendar__day--pickup" : ""
            }`}
          >
            <div className="PrescriptionCalendar__dayNumber">
              {day.date.toLocaleDateString("en-GB", {
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
