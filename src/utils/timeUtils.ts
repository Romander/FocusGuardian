export const isWithinTimeRange = (
  currentTimeStr: string,
  fromTimeStr: string,
  toTimeStr: string,
): boolean => {
  const fromTime = parseTimeToUTCDate(fromTimeStr);
  const toTime = parseTimeToUTCDate(toTimeStr);
  const currentTime = parseTimeToUTCDate(currentTimeStr);

  if (fromTime && toTime && currentTime) {
    // If startTime is greater than endTime, it means the time range spans over midnight.
    if (fromTime > toTime) {
      return currentTime > fromTime || currentTime <= toTime;
    }

    return currentTime >= fromTime && currentTime < toTime;
  }

  return false;
};

export const getCurrentTimeInUTC = (): string => {
  const date = new Date();
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const getAdjustedIntervalDuration = (
  tabHidden: boolean,
  currentTimeStr: string,
  fromTimeStr: string,
  toTimeStr: string,
): number => {
  if (tabHidden) {
    return 10 * 60 * 1000; // Check every 10 minutes if tab is not active
  }

  const fromTime = parseTimeToUTCDate(fromTimeStr);
  const toTime = parseTimeToUTCDate(toTimeStr);
  const currentTime = parseTimeToUTCDate(currentTimeStr);

  if (fromTime && toTime && currentTime) {
    if (currentTime < fromTime) {
      const timeDiff = fromTime.getTime() - currentTime.getTime();

      if (timeDiff >= 4 * 60 * 60 * 1000) {
        return 10 * 60 * 1000; // check every 10 minutes
      } else {
        return 5 * 60 * 1000; // check every 5 minutes
      }
    } else if (currentTime >= fromTime && currentTime < toTime) {
      const timeDiff = toTime.getTime() - currentTime.getTime();

      if (timeDiff >= 4 * 60 * 60 * 1000) {
        return 10 * 60 * 1000; // check every 10 minutes
      } else if (timeDiff >= 30 * 60 * 1000) {
        return 5 * 60 * 1000; // check every 5 minutes
      } else {
        return 30 * 1000; // check every 30 seconds
      }
    } else {
      // Current time is after `timeToParsed`
      return 10 * 60 * 1000; // Default behavior to check every 10 minutes
    }
  }

  return 0;
};

export const localToUTCTime = (localTime: string): string | null => {
  if (localTime) {
    const [hours, minutes] = localTime.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);

    // Convert to UTC time string
    const utcHours = date.getUTCHours();
    const utcMinutes = date.getUTCMinutes();

    return `${utcHours.toString().padStart(2, "0")}:${utcMinutes
      .toString()
      .padStart(2, "0")}`;
  }

  return null;
};

// Convert UTC time to local time
export const utcToLocalTime = (utcTime: string): string | null => {
  const utcDate = parseTimeToUTCDate(utcTime);

  if (utcDate) {
    return utcDate.toLocaleTimeString("it-IT", {
      minute: "2-digit",
      hour: "2-digit",
      hour12: false,
    });
  }

  return null;
};

const parseTimeToUTCDate = (time: string): Date | null => {
  if (time) {
    const currentUtcTime = new Date(); // Get the current time

    return new Date(
      Date.UTC(
        currentUtcTime.getUTCFullYear(),
        currentUtcTime.getUTCMonth(),
        currentUtcTime.getUTCDate(),
        ...time.split(":").map(Number),
      ),
    );
  }

  return null;
};
