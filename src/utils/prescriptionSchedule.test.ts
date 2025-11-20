import { describe, it, expect } from "vitest";
import { generateSchedule } from "./prescriptionSchedule";
import type { PrescriptionData } from "../types/prescriptionData";
import type { AvailableDays } from "../types/days";

describe("generateSchedule", () => {
  const testAvailableDays: AvailableDays = {
    monday: true,
    tuesday: false,
    wednesday: true,
    thursday: false,
    friday: true,
    saturday: false,
    sunday: false,
  };

  describe("stabilisation prescription", () => {
    it("should generate 14-day schedule with fixed dosage", () => {
      const prescriptionData: PrescriptionData = {
        country: "england",
        initialDate: new Date("2024-03-15"),
        availableDays: testAvailableDays,
        prescriptionType: "stabilisation",
        dosage: 30,
      };

      const schedule = generateSchedule(prescriptionData, new Set());

      expect(schedule).toHaveLength(14);
      expect(schedule[0].dosage).toBe(30);
      expect(schedule[13].dosage).toBe(30);
    });

    it("should mark available days as pickup days", () => {
      const prescriptionData: PrescriptionData = {
        country: "england",
        initialDate: new Date("2024-03-18"),
        availableDays: testAvailableDays,
        prescriptionType: "stabilisation",
        dosage: 20,
      };

      const schedule = generateSchedule(prescriptionData, new Set());

      const pickupDays = schedule.filter((day) => day.isPickupDay);
      expect(pickupDays.length).toBeGreaterThan(0);
      expect(schedule[0].isPickupDay).toBe(true);
    });

    it("should accumulate dosage on pickup days", () => {
      const prescriptionData: PrescriptionData = {
        country: "england",
        initialDate: new Date("2024-03-18"),
        availableDays: testAvailableDays,
        prescriptionType: "stabilisation",
        dosage: 10,
      };

      const schedule = generateSchedule(prescriptionData, new Set());

      const firstPickup = schedule[0];
      expect(firstPickup.pickupDosage).toBeGreaterThan(firstPickup.dosage);
      expect(firstPickup.dosageDetails.length).toBeGreaterThan(1);
    });
  });

  describe("reducing prescription", () => {
    it("should decrease dosage over time", () => {
      const prescriptionData: PrescriptionData = {
        country: "england",
        initialDate: new Date("2024-03-15"),
        availableDays: testAvailableDays,
        prescriptionType: "reducing",
        dosage: 40,
        changeAmount: 5,
        changeFrequency: 7,
      };

      const schedule = generateSchedule(prescriptionData, new Set());

      expect(schedule[0].dosage).toBe(40);
      expect(schedule[7].dosage).toBe(35);
      expect(schedule[13].dosage).toBe(35);
    });

    it("should not go below zero dosage", () => {
      const prescriptionData: PrescriptionData = {
        country: "england",
        initialDate: new Date("2024-03-15"),
        availableDays: testAvailableDays,
        prescriptionType: "reducing",
        dosage: 10,
        changeAmount: 20,
        changeFrequency: 7,
      };

      const schedule = generateSchedule(prescriptionData, new Set());

      const allDosages = schedule.map((day) => day.dosage);
      expect(Math.min(...allDosages)).toBeGreaterThanOrEqual(0);
    });
  });

  describe("increasing prescription", () => {
    it("should increase dosage over time", () => {
      const prescriptionData: PrescriptionData = {
        country: "england",
        initialDate: new Date("2024-03-15"),
        availableDays: testAvailableDays,
        prescriptionType: "increasing",
        dosage: 0,
        changeAmount: 5,
        changeFrequency: 7,
      };

      const schedule = generateSchedule(prescriptionData, new Set());

      expect(schedule[0].dosage).toBe(0);
      expect(schedule[7].dosage).toBe(5);
      expect(schedule[13].dosage).toBe(5);
    });

    it("should allow starting from zero dosage", () => {
      const prescriptionData: PrescriptionData = {
        country: "england",
        initialDate: new Date("2024-03-15"),
        availableDays: testAvailableDays,
        prescriptionType: "increasing",
        dosage: 0,
        changeAmount: 2,
        changeFrequency: 3,
      };

      const schedule = generateSchedule(prescriptionData, new Set());

      expect(schedule[0].dosage).toBe(0);
      expect(schedule.some((day) => day.dosage > 0)).toBe(true);
    });
  });

  describe("bank holidays", () => {
    it("should mark bank holidays correctly", () => {
      const bankHolidays = new Set(["2024-03-18", "2024-03-22"]);
      const prescriptionData: PrescriptionData = {
        country: "england",
        initialDate: new Date("2024-03-18"),
        availableDays: testAvailableDays,
        prescriptionType: "stabilisation",
        dosage: 20,
      };

      const schedule = generateSchedule(prescriptionData, bankHolidays);

      const holidayDays = schedule.filter((day) => day.isBankHoliday);
      expect(holidayDays.length).toBeGreaterThan(0);
    });

    it("should skip bank holidays for pickup days", () => {
      const bankHolidays = new Set(["2024-03-20"]);
      const prescriptionData: PrescriptionData = {
        country: "england",
        initialDate: new Date("2024-03-18"),
        availableDays: testAvailableDays,
        prescriptionType: "stabilisation",
        dosage: 20,
      };

      const schedule = generateSchedule(prescriptionData, bankHolidays);

      const wednesday = schedule.find(day => day.dayOfWeek === "wednesday");
      expect(wednesday).toBeDefined();
      expect(wednesday?.isBankHoliday).toBe(true);
      expect(wednesday?.isPickupDay).toBe(false);
    });
  });

  describe("schedule structure", () => {
    it("should include required properties for each day", () => {
      const prescriptionData: PrescriptionData = {
        country: "england",
        initialDate: new Date("2024-03-15"),
        availableDays: testAvailableDays,
        prescriptionType: "stabilisation",
        dosage: 25,
      };

      const schedule = generateSchedule(prescriptionData, new Set());

      schedule.forEach((day, index) => {
        expect(day).toHaveProperty("date");
        expect(day).toHaveProperty("dayOfWeek");
        expect(day).toHaveProperty("isPickupDay");
        expect(day).toHaveProperty("isBankHoliday");
        expect(day).toHaveProperty("dosage");
        expect(day).toHaveProperty("pickupDosage");
        expect(day).toHaveProperty("dosageDetails");
        expect(day).toHaveProperty("dayNumber");
        expect(day.dayNumber).toBe(index + 1);
      });
    });

    it("should have sequential dates", () => {
      const prescriptionData: PrescriptionData = {
        country: "england",
        initialDate: new Date("2024-03-15"),
        availableDays: testAvailableDays,
        prescriptionType: "stabilisation",
        dosage: 25,
      };

      const schedule = generateSchedule(prescriptionData, new Set());

      for (let i = 1; i < schedule.length; i++) {
        const prevDate = new Date(schedule[i - 1].date);
        const currDate = new Date(schedule[i].date);
        const dayDiff =
          (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
        expect(dayDiff).toBe(1);
      }
    });
  });
});
