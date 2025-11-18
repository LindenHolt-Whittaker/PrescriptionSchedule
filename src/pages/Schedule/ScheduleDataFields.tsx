import DataFields from "../../components/DataFields";
import { formatLongDate } from "../../utils/date";
import { formatSelectedDays } from "../../utils/days";
import { type PrescriptionData } from "../../types/prescriptionData";

const ScheduleDataFields = ({
  scheduleData,
}: {
  scheduleData: PrescriptionData;
}) => {
  const isStabilisingType = scheduleData.prescriptionType === "stabilisation";
  const isIncreasingType = scheduleData.prescriptionType === "increasing";

  const dataFields = [
    {
      label: "Prescription pickup schedule date",
      field: formatLongDate(scheduleData.initialDate),
      column: 0,
    },
    {
      label: "Available days",
      field: formatSelectedDays(scheduleData.availableDays),
      column: 0,
    },
    {
      label: "Prescription type",
      field:
        scheduleData.prescriptionType.charAt(0).toUpperCase() +
        scheduleData.prescriptionType.slice(1),
      column: isStabilisingType ? 1 : 0,
    },
    {
      label: isStabilisingType ? "Dosage" : "Initial dosage",
      field: `${scheduleData.dosage}ml`,
      column: 1,
    },
  ];

  if (!isStabilisingType) {
    dataFields.push(
      ...[
        {
          label: `Dosage ${isIncreasingType ? "increase" : "reduction"} amount`,
          field: `${scheduleData.changeAmount}ml`,
          column: 1,
        },
        {
          label: `Dosage ${
            isIncreasingType ? "increase" : "reduction"
          } frequency`,
          field: `Every ${scheduleData.changeFrequency} days`,
          column: 1,
        },
      ]
    );
  }

  return <DataFields fields={dataFields} />;
};

export default ScheduleDataFields;
