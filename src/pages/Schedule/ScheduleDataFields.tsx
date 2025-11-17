import DataFields from "../../components/DataFields";
import { formatLongDate } from "../../utils/date";
import { formatSelectedDays } from "../../utils/days";
import { type PrescriptionData } from "../../types/prescriptionData";

const ScheduleDataFields = ({scheduleData}: {scheduleData: PrescriptionData}) => {
  const dataFields = [
    { label: "Initial date", field: formatLongDate(scheduleData.initialDate) },
    {
      label: "Available days",
      field: formatSelectedDays(scheduleData.availableDays),
    },
    {
      label: "Prescription type",
      field:
        scheduleData.prescriptionType.charAt(0).toUpperCase() +
        scheduleData.prescriptionType.slice(1),
    },
    {
      label:
        scheduleData.prescriptionType !== "stabilisation"
          ? "Initial dosage"
          : "Dosage",
      field: `${scheduleData.dosage}mg`,
    },
  ];

  if (scheduleData.prescriptionType !== "stabilisation") {
    dataFields.push(...[
      {
        label: `Dosage ${
          scheduleData.prescriptionType === "increasing"
            ? "increase"
            : "reduction"
        } amount`,
        field: `${scheduleData.changeAmount}mg`,
      },
      {
        label: `Dosage ${
          scheduleData.prescriptionType === "increasing"
            ? "increase"
            : "reduction"
        } frequency`,
        field: `Every ${scheduleData.changeFrequency} days`,
      },
    ]);
  }

  return (
    <DataFields fields={dataFields} />
  );
};

export default ScheduleDataFields;
