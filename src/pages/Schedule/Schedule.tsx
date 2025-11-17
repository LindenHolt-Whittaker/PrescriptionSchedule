import { Navigate, useLocation } from "react-router-dom";

import Page from "../../components/Page";
import PrescriptionCalendar from "../../components/PrescriptionCalendar";
import { decodePrescriptionKey } from "../../utils/scheduleKey";
import { validatePrescriptionData } from "../../utils/validatePrescriptionData";
import { formatLongDate } from "../../utils/date";
import { formatSelectedDays } from "../../utils/days";
import { type PrescriptionData } from "../../types/prescriptionData";
import "./Schedule.scss";

const Schedule = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  let scheduleData: PrescriptionData | null = null;

  try {
    const key = searchParams.get("k") ?? "";
    const data = decodePrescriptionKey(key);
    scheduleData = validatePrescriptionData(data);
  } catch (error) {
    console.error("Invalid schedule data:", error);
  }

  if (!scheduleData) {
    return <Navigate to="/invalidSchedule" replace />;
  }

  return (
    <Page title="Your prescription schedule" className="Schedule">
      <div className="PrescriptionCalendarContainer">
        <PrescriptionCalendar scheduleData={scheduleData} />
      </div>

      <div className="Schedule__dataFieldGroup">
        <div className="Schedule__dataField">
          {formatLongDate(scheduleData.initialDate)}
        </div>
        <div className="Schedule__dataField">
          {formatSelectedDays(scheduleData.availableDays)}
        </div>
        <div className="Schedule__dataField">
          {scheduleData.prescriptionType.charAt(0).toUpperCase() +
            scheduleData.prescriptionType.slice(1)}
        </div>
        <div className="Schedule__dataField">{scheduleData.dosage}mg</div>
        {scheduleData.changeAmount && (
          <div className="Schedule__dataField">
            {scheduleData.changeAmount}mg
          </div>
        )}
        {scheduleData.changeFrequency && (
          <div className="Schedule__dataField">
            Every {scheduleData.changeFrequency} days
          </div>
        )}
      </div>
    </Page>
  );
};

export default Schedule;
