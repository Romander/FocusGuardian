import * as timezoneMock from "timezone-mock";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  getAdjustedIntervalDuration,
  isWithinTimeRange,
  localToUTCTime,
  utcToLocalTime,
} from "./timeUtils";

describe("isWithinTimeRange", () => {
  it("should return true if current time is within range", () => {
    expect(isWithinTimeRange("15:00", "14:00", "16:00")).toBeTruthy();
  });

  it("should return false if current time is out of range", () => {
    expect(isWithinTimeRange("13:00", "14:00", "16:00")).toBeFalsy();
  });

  it("should return true if time range spans over midnight and current time is within range", () => {
    expect(isWithinTimeRange("01:00", "21:00", "04:00")).toBeTruthy();
  });

  it("should return true if current time is exactly at the start of the range", () => {
    expect(isWithinTimeRange("14:00", "14:00", "16:00")).toBeTruthy();
  });

  it("should return false if current time is exactly at the end of the range", () => {
    expect(isWithinTimeRange("16:00", "14:00", "16:00")).toBeFalsy();
  });

  it("should return false if time range spans over midnight and current time is after the end of the range", () => {
    expect(isWithinTimeRange("05:00", "21:00", "04:00")).toBeFalsy();
  });
});

describe("getAdjustedIntervalDuration", () => {
  it("should return 10 minutes for hidden tabs", () => {
    expect(getAdjustedIntervalDuration(true, "14:00", "12:00", "16:00")).toBe(
      10 * 60 * 1000,
    );
  });

  it("should return appropriate interval for visible tabs", () => {
    expect(getAdjustedIntervalDuration(false, "12:00", "11:00", "16:00")).toBe(
      10 * 60 * 1000,
    ); // more than 4 hours from timeFrom

    expect(getAdjustedIntervalDuration(false, "12:00", "12:30", "16:00")).toBe(
      5 * 60 * 1000,
    ); // less than 30 minutes from timeFrom

    expect(getAdjustedIntervalDuration(false, "12:00", "12:00", "16:00")).toBe(
      10 * 60 * 1000,
    ); // more than 30 minutes to timeTo but less than 4 hours
  });

  it("should return appropriate interval when current time is exactly at timeFrom", () => {
    expect(getAdjustedIntervalDuration(false, "12:00", "12:00", "13:00")).toBe(
      5 * 60 * 1000,
    ); // 1 hour difference, so should check every 10 minutes
  });

  it("should return appropriate interval when there's less than 30 minutes to timeTo", () => {
    expect(getAdjustedIntervalDuration(false, "15:35", "12:00", "16:00")).toBe(
      30 * 1000,
    ); // less than 30 minutes to timeTo
  });

  it("should return appropriate interval when current time is past timeTo", () => {
    // Here you might need to decide on expected behavior, whether you default to 10 minutes, or add logic to handle this scenario.
    expect(getAdjustedIntervalDuration(false, "17:00", "12:00", "16:00")).toBe(
      10 * 60 * 1000,
    ); // This assumes default behavior is to check every 10 minutes
  });
});

describe("Time conversion functions", () => {
  beforeAll(() => {
    timezoneMock.register("Etc/GMT-2");
  });

  afterAll(() => {
    timezoneMock.unregister();
  });

  it("should convert local time to UTC time", () => {
    const localTime = "18:00"; // Assuming the time zone offset is UTC+2
    const expectedUTCTime = "16:00";
    const result = localToUTCTime(localTime);
    expect(result).toBe(expectedUTCTime);
  });

  it("should convert midnight local time to UTC time", () => {
    const localTime = "00:00";
    const expectedUTCTime = "22:00"; // day before for UTC+2
    const result = localToUTCTime(localTime);
    expect(result).toBe(expectedUTCTime);
  });

  it("should convert end-of-day local time to UTC time", () => {
    const localTime = "23:59";
    const expectedUTCTime = "21:59";
    const result = localToUTCTime(localTime);
    expect(result).toBe(expectedUTCTime);
  });

  it("should convert midday local time to UTC time", () => {
    const localTime = "12:00";
    const expectedUTCTime = "10:00";
    const result = localToUTCTime(localTime);
    expect(result).toBe(expectedUTCTime);
  });

  it("should convert UTC time to local time", () => {
    const utcTime = "16:00"; // Assuming the time zone offset is UTC+2
    const expectedLocalTime = "18:00";
    const result = utcToLocalTime(utcTime);
    expect(result).toBe(expectedLocalTime);
  });

  it("should convert midnight UTC time to local time", () => {
    const utcTime = "22:00";
    const expectedLocalTime = "00:00"; // next day for UTC+2
    const result = utcToLocalTime(utcTime);
    expect(result).toBe(expectedLocalTime);
  });

  it("should convert end-of-day UTC time to local time", () => {
    const utcTime = "21:59";
    const expectedLocalTime = "23:59";
    const result = utcToLocalTime(utcTime);
    expect(result).toBe(expectedLocalTime);
  });

  it("should convert midday UTC time to local time", () => {
    const utcTime = "10:00";
    const expectedLocalTime = "12:00";
    const result = utcToLocalTime(utcTime);
    expect(result).toBe(expectedLocalTime);
  });
});

// Additional mock for a different timezone
describe("Time conversion functions for UTC-5", () => {
  beforeAll(() => {
    timezoneMock.register("Etc/GMT+5");
  });

  afterAll(() => {
    timezoneMock.unregister();
  });

  it("should convert local time to UTC time for UTC-5", () => {
    const localTime = "10:00"; // Assuming the time zone offset is UTC-5
    const expectedUTCTime = "15:00";
    const result = localToUTCTime(localTime);
    expect(result).toBe(expectedUTCTime);
  });

  it("should convert UTC time to local time for UTC-5", () => {
    const utcTime = "15:00";
    const expectedLocalTime = "10:00";
    const result = utcToLocalTime(utcTime);
    expect(result).toBe(expectedLocalTime);
  });
});
