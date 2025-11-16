import { Navigate, useLocation } from "react-router-dom";

import { type OnboardingFormData } from "./OnboardingForm";
import Page from "../components/Page";
import "./Schedule.scss";

const DataField = ({ children }: { children: React.ReactNode }) => (
  <div className="DataField">{children}</div>
);

const Schedule = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  let scheduleData: OnboardingFormData | null = null;

  try {
    const data = JSON.parse(searchParams.get("data") || "{}");

    // Validate required fields exist
    if (
      data.initialDate &&
      data.availableDays &&
      data.prescriptionType &&
      data.dosage &&
      (data.prescriptionType !== "stabilisation"
        ? data.changeAmount && data.changeFrequency
        : true)
    ) {
      // Turn date string back into a proper Date object
      scheduleData = {
        ...data,
        initialDate: new Date(data.initialDate),
      };
    }
  } catch (error) {
    console.error("Invalid schedule data:", error);
  }

  if (!scheduleData) {
    return <Navigate to="/" replace />;
  }

  const formattedDate = scheduleData.initialDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const selectedDays = Object.entries(scheduleData.availableDays)
    .filter(([, isSelected]) => isSelected)
    .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1))
    .join(", ");

  return (
    <Page title="Your prescription schedule" className="Schedule">
      <DataField>{formattedDate}</DataField>
      <DataField>{selectedDays}</DataField>
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
