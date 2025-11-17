import { Navigate, useLocation } from "react-router-dom";

import Page from "../../components/Page";
import { decodePrescriptionKey } from "../../utils/scheduleKey";
import { validatePrescriptionData } from "../../utils/validatePrescriptionData";
import { type PrescriptionData } from "../../types/prescriptionData";
import PrescriptionCalendar from "./PrescriptionCalendar";
import ScheduleDataFields from "./ScheduleDataFields";
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

      <ScheduleDataFields scheduleData={scheduleData} />
    </Page>
  );
};

export default Schedule;
