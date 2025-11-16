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

    // Calculate base dosage for this day based on prescription type
    let dosage = scheduleData.dosage;
    
    if (scheduleData.changeAmount && scheduleData.changeFrequency) {
      const daysPassed = i;
      const changes = Math.floor(daysPassed / scheduleData.changeFrequency);

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

  // Redistribute dosages from non-pickup days to previous pickup days
  for (let i = 0; i < schedule.length; i++) {
    const currentDay = schedule[i];
    
    // If this is NOT a pickup day and has dosage to redistribute
    if (!currentDay.isPickupDay && currentDay.dosage > 0) {
      // Find the most recent previous pickup day
      let previousPickupIndex = -1;
      for (let j = i - 1; j >= 0; j--) {
        if (schedule[j].isPickupDay) {
          previousPickupIndex = j;
          break;
        }
      }

      if (previousPickupIndex !== -1) {
        // Move dosage to the previous pickup day, and set current day dosage to 0
        schedule[previousPickupIndex].dosage += currentDay.dosage;
        currentDay.dosage = 0;
      } else {
        // No previous pickup day exists (should never occur, as we start on a pickup day)
        console.warn('Found non-pickup day before first pickup day');
      }
    }
  }

  return schedule;
};
