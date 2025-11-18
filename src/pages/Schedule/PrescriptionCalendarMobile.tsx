import { useState } from "react";
import { type ScheduleDay } from "../../types/scheduleData";
import "./PrescriptionCalendarMobile.scss";

interface PrescriptionCalendarMobileProps {
  schedule: ScheduleDay[];
}

const PrescriptionCalendarMobile = ({
  schedule,
}: PrescriptionCalendarMobileProps) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const toggleDay = (dayNumber: number) => {
    setExpandedDay(expandedDay === dayNumber ? null : dayNumber);
  };

  return (
    <div className="PrescriptionCalendarMobile">
      {schedule.map((day) => {
        const isExpanded = expandedDay === day.dayNumber;

        return (
          <div
            key={day.date.toISOString()}
            className={`PrescriptionCalendarMobile__item ${
              day.isPickupDay ? "PrescriptionCalendarMobile__item--pickup" : ""
            } ${
              day.isBankHoliday
                ? "PrescriptionCalendarMobile__item--holiday"
                : ""
            } ${
              isExpanded ? "PrescriptionCalendarMobile__item--expanded" : ""
            }`}
            onClick={() => toggleDay(day.dayNumber)}
          >
            <div className="PrescriptionCalendarMobile__header">
              <div className="PrescriptionCalendarMobile__leftContainer">
                <span className="PrescriptionCalendarMobile__dayNumber">
                  Day {day.dayNumber}
                </span>
                <span className="PrescriptionCalendarMobile__dayName">
                  {day.date.toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
              <div className="PrescriptionCalendarMobile__rightContainer">
                {day.isBankHoliday && (
                  <div className="PrescriptionCalendarMobile__bankHolidayText">
                    Bank Holiday
                  </div>
                )}
                <div className="PrescriptionCalendarMobile__dosage">
                  {day.dosage}
                  <span className="PrescriptionCalendarMobile__dosage--ml">
                    ml
                  </span>
                </div>
                <div
                  className="PrescriptionCalendarMobile__chevron"
                  style={{
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  ▼
                </div>
              </div>
            </div>

            <div
              className={`PrescriptionCalendarMobile__details ${
                day.isPickupDay
                  ? "PrescriptionCalendarMobile__details--pickup"
                  : ""
              } ${
                day.isBankHoliday
                  ? "PrescriptionCalendarMobile__details--holiday"
                  : ""
              } ${
                isExpanded
                  ? "PrescriptionCalendarMobile__details--expanded"
                  : ""
              }`}
            >
              <div className="PrescriptionCalendarMobile__detail">
                {day.date.toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="PrescriptionCalendarMobile__detail">
                Dosage: {day.dosage}
                <span className="PrescriptionCalendarMobile__detail--ml">
                  ml
                </span>
              </div>
              {day.isPickupDay && (
                <div className="PrescriptionCalendarMobile__badge PrescriptionCalendarMobile__badge--pickup">
                  ✓ Pickup Day
                </div>
              )}
              {day.isBankHoliday && (
                <div className="PrescriptionCalendarMobile__badge PrescriptionCalendarMobile__badge--holiday">
                  ⚑ Bank Holiday
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PrescriptionCalendarMobile;
