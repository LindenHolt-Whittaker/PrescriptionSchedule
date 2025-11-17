import { type PrescriptionData } from "../../types/prescriptionData";
import { generateSchedule } from "../../utils/prescriptionSchedule";
import { type ScheduleDay } from "../../types/scheduleData";
import "./PrescriptionCalendar.scss";

interface PrescriptionCalendarProps {
  scheduleData: PrescriptionData;
}

const PrescriptionCalendar = ({ scheduleData }: PrescriptionCalendarProps) => {
  const schedule = generateSchedule(scheduleData);

  // Group by month for multi-month display
  const scheduleByMonth = schedule.reduce((acc, day) => {
    const monthKey = day.date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
    });
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(day);
    return acc;
  }, {} as Record<string, ScheduleDay[]>);

  return (
    <div className="PrescriptionCalendar">
      {Object.entries(scheduleByMonth).map(([month, days]) => (
        <div key={month} className="PrescriptionCalendar__month">
          <h2>{month}</h2>
          <div className="PrescriptionCalendar__grid">
            <div className="PrescriptionCalendar__header">Mon</div>
            <div className="PrescriptionCalendar__header">Tue</div>
            <div className="PrescriptionCalendar__header">Wed</div>
            <div className="PrescriptionCalendar__header">Thu</div>
            <div className="PrescriptionCalendar__header">Fri</div>
            <div className="PrescriptionCalendar__header PrescriptionCalendar__header--weekend">
              Sat
            </div>
            <div className="PrescriptionCalendar__header PrescriptionCalendar__header--weekend">
              Sun
            </div>

            {/* Add empty divs for offset */}
            {days[0] &&
              Array.from({ length: (days[0].date.getDay() + 6) % 7 }).map(
                (_, i) => (
                  <div
                    key={`offset-${i}`}
                    className="PrescriptionCalendar__day--empty"
                  />
                )
              )}

            {days.map((day) => (
              <div
                key={day.date.toISOString()}
                className={`PrescriptionCalendar__day ${
                  day.isPickupDay ? "PrescriptionCalendar__day--pickup" : ""
                }`}
              >
                <div className="PrescriptionCalendar__dayNumber">
                  {day.date.getDate()}
                </div>
                <div
                  className={`PrescriptionCalendar__dosage ${
                    day.isPickupDay
                      ? "PrescriptionCalendar__dosage--pickup"
                      : ""
                  }`}
                >
                  {day.dosage}mg
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrescriptionCalendar;
