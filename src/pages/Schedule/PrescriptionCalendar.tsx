import { useEffect, useState } from 'react';
import { type PrescriptionData } from "../../types/prescriptionData";
import { generateSchedule } from "../../utils/prescriptionSchedule";
import { fetchUKBankHolidays } from "../../utils/bankHolidays";
import { type ScheduleDay } from "../../types/scheduleData";
import "./PrescriptionCalendar.scss";

interface PrescriptionCalendarProps {
  scheduleData: PrescriptionData;
}

const PrescriptionCalendar = ({ scheduleData }: PrescriptionCalendarProps) => {
  const [bankHolidays, setBankHolidays] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUKBankHolidays('england-and-wales')
      .then(setBankHolidays)
      .finally(() => setIsLoading(false));
  }, []);

  // Wait for bank holidays to load before generating schedule
  if (isLoading) {
    return (
      <div className="PrescriptionCalendar PrescriptionCalendar--loading">
        <p className='PrescriptionCalendar--loading__text'>Loading schedule...</p>
      </div>
    );
  }

  const schedule = generateSchedule(scheduleData, bankHolidays);

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
                } ${
                  day.isBankHoliday ? "PrescriptionCalendar__day--holiday" : ""
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
                  {day.dosage}<span className="PrescriptionCalendar__dosage--mg">mg</span>
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
