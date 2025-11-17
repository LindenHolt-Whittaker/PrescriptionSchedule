import { Navigate, useLocation } from "react-router-dom";

import Page from "../../components/Page";
import PrescriptionCalendar from "../../components/PrescriptionCalendar";
import { decodePrescriptionKey } from "../../utils/scheduleKey";
import { validatePrescriptionData } from "../../utils/validatePrescriptionData";
import { formatLongDate } from "../../utils/date";
import { formatSelectedDays } from "../../utils/days";
import { type PrescriptionData } from "../../types/prescriptionData";
import "./Schedule.scss";

const DataField = ({ children }: { children: React.ReactNode }) => (
  <div className="DataField">{children}</div>
);

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
      <DataField>{formatLongDate(scheduleData.initialDate)}</DataField>
      <DataField>{formatSelectedDays(scheduleData.availableDays)}</DataField>
      <DataField>{scheduleData.prescriptionType}</DataField>
      <DataField>{scheduleData.dosage}</DataField>
      {scheduleData.changeAmount && (
        <DataField>{scheduleData.changeAmount}</DataField>
      )}
      {scheduleData.changeFrequency && (
        <DataField>{scheduleData.changeFrequency}</DataField>
      )}

      <div className="PrescriptionCalendarContainer">
        <PrescriptionCalendar scheduleData={scheduleData} />
      </div>
    </Page>
  );
};

export default Schedule;
