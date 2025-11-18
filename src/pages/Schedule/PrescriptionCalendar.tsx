import { useEffect, useState } from "react";
import { type PrescriptionData } from "../../types/prescriptionData";
import { generateSchedule } from "../../utils/prescriptionSchedule";
import { fetchUKBankHolidays } from "../../utils/bankHolidays";
import { useIsMobile } from "../../hooks/useMediaQuery";
import PrescriptionCalendarDesktop from "./PrescriptionCalendarDesktop";
import PrescriptionCalendarMobile from "./PrescriptionCalendarMobile";
import "./PrescriptionCalendar.scss";

interface PrescriptionCalendarProps {
  scheduleData: PrescriptionData;
}

const PrescriptionCalendar = ({ scheduleData }: PrescriptionCalendarProps) => {
  const [bankHolidays, setBankHolidays] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchUKBankHolidays("england-and-wales")
      .then(setBankHolidays)
      .finally(() =>
        setTimeout(() => {
          setIsLoading(false);
        }, 500)
      );
  }, []);

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

  return isMobile ? (
    <PrescriptionCalendarMobile schedule={schedule} />
  ) : (
    <PrescriptionCalendarDesktop schedule={schedule} />
  );
};

export default PrescriptionCalendar;
