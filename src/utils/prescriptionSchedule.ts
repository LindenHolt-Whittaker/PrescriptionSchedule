import { type PrescriptionData } from "../types/prescriptionData";
import { type ScheduleDay } from "../types/scheduleData";
import { type DayName } from "../types/days";

const findFirstPickupDate = (
  initialDate: Date,
  availableDays: Record<DayName, boolean>
): Date => {
  const currentDate = new Date(initialDate);
  
  // Check up to 7 days ahead to find first available day
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(currentDate);
    checkDate.setDate(currentDate.getDate() + i);
    
    const dayName = checkDate
      .toLocaleDateString("en-GB", { weekday: "long" })
      .toLowerCase() as DayName;
    
    if (availableDays[dayName]) {
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
  return null; // No more pickup days
};

// TODO: account for bank holidays using gov API 
export const generateSchedule = (
  scheduleData: PrescriptionData
): ScheduleDay[] => {
  const schedule: ScheduleDay[] = [];
  
  // Find the first available pickup day
  const startDate = findFirstPickupDate(
    scheduleData.initialDate,
    scheduleData.availableDays
  );

  // Generate initial 2 week schedule with calculated dosages
  for (let i = 0; i < 14; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const dayName = currentDate
      .toLocaleDateString("en-GB", { weekday: "long" })
      .toLowerCase() as DayName;
    const isPickupDay = scheduleData.availableDays[dayName];
    const dosage = calculateDayDosage(i, scheduleData);

    schedule.push({
      date: currentDate,
      dayOfWeek: dayName,
      isPickupDay,
      dosage,
      dayNumber: i + 1,
    });
  }

  // Redistribute dosages from pickup day to next pickup day
  for (let i = 0; i < schedule.length; i++) {
    const currentDay = schedule[i];

    if (currentDay.isPickupDay) {
      const nextPickupIndex = findNextPickupIndex(schedule, i);
      const endIndex = nextPickupIndex ?? schedule.length;

      // Accumulate all dosages from current day to day before next pickup
      let totalDosage = 0;
      for (let j = i; j < endIndex; j++) {
        totalDosage += schedule[j].dosage;
        // Set non-pickup days to 0
        if (j > i) {
          schedule[j].dosage = 0;
        }
      }

      // Assign accumulated dosage to pickup day
      currentDay.dosage = totalDosage;

      // If no dosage, then unassign pickup status
      if (currentDay.dosage <= 0) {
        currentDay.isPickupDay = false;
      }
    }
  }

  return schedule;
};
