import { useState, useRef, useEffect } from "react";

import { formatLongDate, formatShortDate } from "../../utils/date";
import { type ScheduleDay } from "../../types/scheduleData";
import "./PrescriptionCalendarDesktop.scss";

interface PrescriptionCalendarDesktopProps {
  schedule: ScheduleDay[];
}

const PrescriptionCalendarDesktop = ({
  schedule,
}: PrescriptionCalendarDesktopProps) => {
  const [selectedDay, setSelectedDay] = useState<ScheduleDay | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

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
    <div className="PrescriptionCalendarDesktop">
      {Object.entries(scheduleByMonth).map(([month, days]) => (
        <div key={month} className="PrescriptionCalendarDesktop__month">
          <h2>{month}</h2>
          <div className="PrescriptionCalendarDesktop__grid">
            <div className="PrescriptionCalendarDesktop__header">Mon</div>
            <div className="PrescriptionCalendarDesktop__header">Tue</div>
            <div className="PrescriptionCalendarDesktop__header">Wed</div>
            <div className="PrescriptionCalendarDesktop__header">Thu</div>
            <div className="PrescriptionCalendarDesktop__header">Fri</div>
            <div className="PrescriptionCalendarDesktop__header PrescriptionCalendarDesktop__header--weekend">
              Sat
            </div>
            <div className="PrescriptionCalendarDesktop__header PrescriptionCalendarDesktop__header--weekend">
              Sun
            </div>

            {days[0] &&
              Array.from({ length: (days[0].date.getDay() + 6) % 7 }).map(
                (_, i) => (
                  <div
                    key={`offset-${i}`}
                    className="PrescriptionCalendarDesktop__day--empty"
                  />
                )
              )}

            {days.map((day) => (
              <div className="PrescriptionCalendarDesktop__dayContainer">
                <div
                  key={day.date.toISOString()}
                  onClick={() => handleDayClick(day)}
                  className={`PrescriptionCalendarDesktop__day ${
                    day.isPickupDay
                      ? "PrescriptionCalendarDesktop__day--pickup"
                      : ""
                  } ${
                    day.isBankHoliday
                      ? "PrescriptionCalendarDesktop__day--holiday"
                      : ""
                  } ${
                    selectedDay?.date.toISOString() === day.date.toISOString()
                      ? "PrescriptionCalendarDesktop__day--selected"
                      : ""
                  }`}
                >
                  <div className="PrescriptionCalendarDesktop__dayNumber">
                    {day.date.getDate()}
                  </div>
                  <div
                    className={`PrescriptionCalendarDesktop__dosage ${
                      day.isPickupDay
                        ? "PrescriptionCalendarDesktop__dosage--pickup"
                        : ""
                    }`}
                  >
                    {day.pickupDosage}
                    <span className="PrescriptionCalendarDesktop__dosage--ml">
                      ml
                    </span>
                  </div>
                </div>

                {selectedDay?.date.toISOString() === day.date.toISOString() && (
                  <div
                    ref={popupRef}
                    className="PrescriptionCalendarDesktop__popup"
                  >
                    <div className="PrescriptionCalendarDesktop__popup__chevron" />
                    <div className="PrescriptionCalendarDesktop__popup__content">
                      <div className="PrescriptionCalendarDesktop__popup__heading">
                        {formatLongDate(day.date)}
                      </div>
                      <div className="PrescriptionCalendarDesktop__popup__dosage">
                        Prescription amount: {day.pickupDosage}
                        <span className="PrescriptionCalendarDesktop__popup__dosage__ml">
                          ml
                        </span>
                      </div>
                      <div className="PrescriptionCalendarDesktop__popup__bottomContainer">
                        <div className="PrescriptionCalendarDesktop__popup__dosageDetails">
                          {day.dosageDetails.length > 0 && (
                            <>
                              Dosage details:
                              {day.dosageDetails.map(({ date, dosage }) => (
                                <div>
                                  {formatShortDate(date)}: {dosage}
                                  <span className="PrescriptionCalendarDesktop__popup__dosageDetails__ml">
                                    ml
                                  </span>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                        {day.isPickupDay && (
                          <div className="PrescriptionCalendarDesktop__popup__badge PrescriptionCalendarDesktop__popup__badge--pickup">
                            ✓ Pickup Day
                          </div>
                        )}
                        {day.isBankHoliday && (
                          <div className="PrescriptionCalendarDesktop__popup__badge PrescriptionCalendarDesktop__popup__badge--holiday">
                            ⚑ Bank Holiday
                          </div>
                        )}
                      </div>
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

export default PrescriptionCalendarDesktop;
