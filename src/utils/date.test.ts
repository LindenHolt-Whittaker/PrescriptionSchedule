import { describe, it, expect } from "vitest";
import { formatLongDate, formatShortDate } from "./date";

describe("formatLongDate", () => {
  it("should format date in long format with en-GB locale", () => {
    let date = new Date("2024-03-15");
    let result = formatLongDate(date);
    expect(result).toBe("Friday, 15 March 2024");

    date = new Date("2024-01-01");
    result = formatLongDate(date);
    expect(result).toBe("Monday, 1 January 2024");

    date = new Date("2024-12-31");
    result = formatLongDate(date);
    expect(result).toBe("Tuesday, 31 December 2024");

    date = new Date("2024-02-29");
    result = formatLongDate(date);
    expect(result).toBe("Thursday, 29 February 2024");
  });
});

describe("formatShortDate", () => {
  it("should format date in short format with en-GB locale", () => {
    let date = new Date("2024-03-15");
    let result = formatShortDate(date);
    expect(result).toBe("15/03/24");

    date = new Date("2024-01-05");
    result = formatShortDate(date);
    expect(result).toBe("05/01/24");

    date = new Date("2025-11-20");
    result = formatShortDate(date);
    expect(result).toBe("20/11/25");
  });
});
