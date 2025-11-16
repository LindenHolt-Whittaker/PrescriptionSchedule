import { type PrescriptionData } from "../types/prescriptionData";
import { formatDate } from "../utils/date";
import { generateSchedule } from "../utils/prescriptionSchedule";
import "./PrescriptionCalendar.scss";

interface PrescriptionCalendarProps {
  scheduleData: PrescriptionData;
}

const PrescriptionCalendar = ({ scheduleData }: PrescriptionCalendarProps) => {
  const schedule = generateSchedule(scheduleData);

  return (
    <div className="PrescriptionCalendar">
      <h2>14-Day Prescription Schedule</h2>
      <ul>
        {schedule.map((day, index) => (
          <li key={day.date.toISOString()}>
            <div>
              <span>Day {index + 1}:</span> {formatDate(day.date)}
            </div>
            <div>
              <span>Dosage: {day.dosage}mg</span>
              {day.isPickupDay && (
                <div className="PrescriptionCalendar__pickupDay">
                  Pickup Day
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PrescriptionCalendar;
