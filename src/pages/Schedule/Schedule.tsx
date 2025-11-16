import { Navigate, useLocation } from "react-router-dom";

import Page from "../../components/Page";
import { formatDate } from "../../utils/date";
import { formatSelectedDays } from "../../utils/days";
import { validatePrescriptionData } from "../../utils/validate";
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
    const data = JSON.parse(searchParams.get("data") || "{}");
    scheduleData = validatePrescriptionData(data);
  } catch (error) {
    console.error("Invalid schedule data:", error);
  }

  if (!scheduleData) {
    return <Navigate to="/" replace />;
  }

  return (
    <Page title="Your prescription schedule" className="Schedule">
      <DataField>{formatDate(scheduleData.initialDate)}</DataField>
      <DataField>{formatSelectedDays(scheduleData.availableDays)}</DataField>
      <DataField>{scheduleData.prescriptionType}</DataField>
      <DataField>{scheduleData.dosage}</DataField>
      {scheduleData.changeAmount && (
        <DataField>{scheduleData.changeAmount}</DataField>
      )}
      {scheduleData.changeFrequency && (
        <DataField>{scheduleData.changeFrequency}</DataField>
      )}
    </Page>
  );
};

export default Schedule;
