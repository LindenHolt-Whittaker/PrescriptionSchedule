import { useEffect, useState, useRef } from "react";
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
  const [selectedDay, setSelectedDay] = useState<ScheduleDay | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUKBankHolidays("england-and-wales")
      .then(setBankHolidays)
      .finally(() =>
        setTimeout(() => {
          setIsLoading(false);
          // Half a second delay to load for UX purposes (prevents jitter on very fast load)
        }, 500)
      );
  }, []);

  // Click outside to close popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setSelectedDay(null);
      }
    };

    if (selectedDay) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedDay]);

  if (isLoading) {
    return (
      <div className="PrescriptionCalendar PrescriptionCalendar--loading">
        <p className="PrescriptionCalendar--loading__text">
          Loading schedule...
        </p>
      </div>
    );
  }

  const schedule = generateSchedule(scheduleData, bankHolidays);

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

  const handleDayClick = (day: ScheduleDay) => {
    setSelectedDay(day);
  };

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
                onClick={() => handleDayClick(day)}
                className={`PrescriptionCalendar__day ${
                  day.isPickupDay ? "PrescriptionCalendar__day--pickup" : ""
                } ${
                  day.isBankHoliday ? "PrescriptionCalendar__day--holiday" : ""
                } ${
                  selectedDay?.date.toISOString() === day.date.toISOString()
                    ? "PrescriptionCalendar__day--selected"
                    : ""
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
                  {day.dosage}
                  <span className="PrescriptionCalendar__dosage--mg">mg</span>
                </div>

                {selectedDay?.date.toISOString() === day.date.toISOString() && (
                  <div ref={popupRef} className="PrescriptionCalendar__popup">
                    <div className="PrescriptionCalendar__popup__chevron" />
                    <div className="PrescriptionCalendar__popup__content">
                      <div className="PrescriptionCalendar__popup__heading">
                        {day.date.toLocaleDateString("en-GB", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <div className="PrescriptionCalendar__popup__detail">
                        Dosage: {day.dosage}mg
                      </div>
                      {day.isPickupDay && (
                        <div className="PrescriptionCalendar__popup__badge PrescriptionCalendar__popup__badge--pickup">
                          ✓ Pickup Day
                        </div>
                      )}
                      {day.isBankHoliday && (
                        <div className="PrescriptionCalendar__popup__badge PrescriptionCalendar__popup__badge--holiday">
                          ⚑ Bank Holiday
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrescriptionCalendar;
