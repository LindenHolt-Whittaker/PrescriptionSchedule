import { describe, it, expect } from "vitest";
import {
  getDefaultDays,
  capitalizeDayName,
  getSelectedDays,
  formatSelectedDays,
} from "./days";
import type { AvailableDays } from "../types/days";

describe("getDefaultDays", () => {
  it("should return all days set to false", () => {
    const result = getDefaultDays();
    expect(result).toEqual({
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    });
  });
});

describe("capitalizeDayName", () => {
  it("should capitalize first letter of day", () => {
    expect(capitalizeDayName("monday")).toBe("Monday");
    expect(capitalizeDayName("friday")).toBe("Friday");
  });
});

describe("getSelectedDays", () => {
  it("should return selected days capitalized", () => {
    const availableDays: AvailableDays = {
      monday: true,
      tuesday: false,
      wednesday: true,
      thursday: false,
      friday: true,
      saturday: false,
      sunday: false,
    };
    const result = getSelectedDays(availableDays);
    expect(result).toHaveLength(3);
    expect(result).toEqual(["Monday", "Wednesday", "Friday"]);
  });

  it("should return all days when all selected", () => {
    const availableDays: AvailableDays = {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    };
    const result = getSelectedDays(availableDays);
    expect(result).toHaveLength(7);
    expect(result).toEqual([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]);
  });
});

describe("formatSelectedDays", () => {
  it("should format selected days with comma separation", () => {
    const availableDays: AvailableDays = {
      monday: false,
      tuesday: true,
      wednesday: false,
      thursday: true,
      friday: false,
      saturday: true,
      sunday: false,
    };
    const result = formatSelectedDays(availableDays);
    expect(result).toBe("Tuesday, Thursday, Saturday");
  });

  it("should format single selected day", () => {
    const availableDays: AvailableDays = {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: true,
      friday: false,
      saturday: false,
      sunday: false,
    };
    const result = formatSelectedDays(availableDays);
    expect(result).toBe("Thursday");
  });
});
