import { type PrescriptionData } from "../types/prescriptionData";
import { type DosageDetail, type ScheduleDay } from "../types/scheduleData";
import { type DayName } from "../types/days";
import { isBankHoliday } from "./bankHolidays";

const findFirstPickupDate = (
  initialDate: Date,
  availableDays: Record<DayName, boolean>,
  bankHolidays: Set<string>
): Date => {
  const currentDate = new Date(initialDate);

  // Check up to 7 days ahead to find first available day
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(currentDate);
    checkDate.setDate(currentDate.getDate() + i);

    const dayName = checkDate
      .toLocaleDateString("en-GB", { weekday: "long" })
      .toLowerCase() as DayName;

    if (availableDays[dayName] && !isBankHoliday(checkDate, bankHolidays)) {
      return checkDate;
    }
  }

  // No previous pickup day exists (should never occur, because we check the whole week)
  console.error("No pickup date found.");
  return currentDate;
};

/**
 * Calculate the dosage for a specific day based on prescription type
 */
const calculateDayDosage = (
  dayIndex: number,
  scheduleData: PrescriptionData
): number => {
  const { prescriptionType, changeAmount, changeFrequency } = scheduleData;
  let dosage = scheduleData.dosage;

  if (changeAmount && changeFrequency) {
    const changes = Math.floor(dayIndex / changeFrequency);

    if (prescriptionType === "increasing") {
      dosage += changes * changeAmount;
    } else if (scheduleData.prescriptionType === "reducing") {
      dosage -= changes * changeAmount;
      dosage = Math.max(0, dosage);
    }
  }

  return dosage;
};

/**
 * Find the next pickup day index from a given position
 */
const findNextPickupIndex = (
  schedule: ScheduleDay[],
  fromIndex: number
): number | null => {
  for (let i = fromIndex + 1; i < schedule.length; i++) {
    if (schedule[i].isPickupDay) {
      return i;
    }
  }
  // No more pickup days
  return null;
};

export const generateSchedule = (
  scheduleData: PrescriptionData,
  bankHolidays: Set<string>
): ScheduleDay[] => {
  const schedule: ScheduleDay[] = [];

  // Find the first available pickup day
  const startDate = findFirstPickupDate(
    scheduleData.initialDate,
    scheduleData.availableDays,
    bankHolidays
  );

  // Generate initial 2 week schedule with calculated dosages
  for (let i = 0; i < 14; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const dayName = currentDate
      .toLocaleDateString("en-GB", { weekday: "long" })
      .toLowerCase() as DayName;

    const isHoliday = isBankHoliday(currentDate, bankHolidays);

    // Can only pickup if it's an available day AND not a bank holiday
    const isPickupDay = scheduleData.availableDays[dayName] && !isHoliday;

    const dosage = calculateDayDosage(i, scheduleData);

    schedule.push({
      date: currentDate,
      dayOfWeek: dayName,
      isPickupDay,
      isBankHoliday: isHoliday,
      dosage,
      pickupDosage: dosage,
      dosageDetails: [],
      dayNumber: i + 1,
    });
  }

  // Redistribute dosages from pickup day to next pickup day
  for (let i = 0; i < schedule.length; i++) {
    const currentDay = schedule[i];

    if (currentDay.isPickupDay) {
      const nextPickupIndex = findNextPickupIndex(schedule, i);
      const endIndex = nextPickupIndex ?? schedule.length;

      // Build dosageDetails array and accumulate total from current day to day before next pickup
      const details: DosageDetail[] = [];
      let totalDosage = 0;
      for (let j = i; j < endIndex; j++) {
        const day = schedule[j];
        
        // Only add to details if there's a dosage
        if (day.dosage > 0) {
          details.push({
            date: new Date(day.date),
            dosage: day.dosage,
          });
          totalDosage += day.dosage;
        }

        // Set non-pickup days to 0
        if (j > i) {
          schedule[j].pickupDosage = 0;
        }
      }

      // Assign accumulated dosage and details to pickup day
      currentDay.pickupDosage = totalDosage;
      currentDay.dosageDetails = details;

      // If no pickupDosage, unassign pickup status
      if (currentDay.pickupDosage <= 0) {
        currentDay.isPickupDay = false;
      }
    }
  }

  return schedule;
};
