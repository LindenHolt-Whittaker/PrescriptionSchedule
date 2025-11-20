import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import Page from "../../components/Page";
import Button from "../../components/Button";
import { decodePrescriptionKey } from "../../utils/scheduleKey";
import { validatePrescriptionData } from "../../utils/validatePrescriptionData";
import { type PrescriptionData } from "../../types/prescriptionData";
import PrescriptionCalendar from "./PrescriptionCalendar";
import ScheduleDataFields from "./ScheduleDataFields";
import "./Schedule.scss";

const Schedule = () => {
  const [copySuccess, setCopySuccess] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  let scheduleData: PrescriptionData | null = null;
  let key: string = "";

  try {
    key = searchParams.get("k") ?? "";
    const data = decodePrescriptionKey(key);
    scheduleData = validatePrescriptionData(data);
  } catch (error) {
    console.error("Invalid schedule data:", error);
  }

  if (!scheduleData) {
    return <Navigate to="/invalidSchedule" replace />;
  }

  const handleEditSchedule = () => {
    navigate(`/onboarding?k=${key}`);
  };

  const handleCopyKey = async () => {
    await navigator.clipboard.writeText(key);
    setCopySuccess(true);

    // Reset the "copied" state after 2 seconds
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  };

  return (
    <Page title="Your prescription schedule" className="Schedule">
      <div className="PrescriptionCalendarContainer">
        <PrescriptionCalendar scheduleData={scheduleData} />
        <div className="PrescriptionCalendarContainer__countrySubtitle">
          {scheduleData.country.charAt(0).toUpperCase() +
          scheduleData.country.slice(1)} bank holidays unavailable for prescription pickup
        </div>
      </div>

      <div className="Schedule__detailsContainer">
        <div className="Schedule__data">
          <ScheduleDataFields scheduleData={scheduleData} />

          <Button onClick={handleEditSchedule} width={10} isSmall>
            Edit Schedule
          </Button>
        </div>

        <div className="Schedule__scheduleKey">
          <div>
            <span className="Schedule__scheduleKey__hash">#</span>
            <span className="Schedule__scheduleKey__key">{key}</span>
          </div>
          <Button onClick={handleCopyKey} width={10} isSmall>
            {copySuccess ? "✓ Copied!" : "Copy Schedule Key"}
          </Button>
        </div>
      </div>
    </Page>
  );
};

export default Schedule;
