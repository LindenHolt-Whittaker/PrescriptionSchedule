import { type PrescriptionData } from "../types/prescriptionData";
import { type ScheduleDay } from "../types/scheduleData";
import { type DayName } from "../types/days";

export const generateSchedule = (
  scheduleData: PrescriptionData
): ScheduleDay[] => {
  const schedule: ScheduleDay[] = [];
  const startDate = new Date(scheduleData.initialDate);

  // Generate schedule for 2 weeks
  for (let i = 0; i < 14; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const dayName = currentDate
      .toLocaleDateString("en-GB", { weekday: "long" })
      .toLowerCase() as DayName;
    const isPickupDay = scheduleData.availableDays[dayName];

    // Calculate dosage based on prescription type
    let dosage = scheduleData.dosage;
    if (scheduleData.changeAmount && scheduleData.changeFrequency) {
      const daysPassed = i;
      const changes = Math.floor(daysPassed / scheduleData.changeFrequency);

      // TODO: account for increased prescription for days unavailable for pickup
      if (scheduleData.prescriptionType === "increasing") {
        dosage += changes * scheduleData.changeAmount;
      } else if (scheduleData.prescriptionType === "reducing") {
        dosage -= changes * scheduleData.changeAmount;
        dosage = Math.max(0, dosage);
      }
    }

    schedule.push({
      date: currentDate,
      dayOfWeek: dayName,
      isPickupDay,
      dosage,
      dayNumber: i + 1,
    });
  }

  return schedule;
};
