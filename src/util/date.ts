export enum DateComponent {
  Timestamp,
  Year,
  Month,
  Day,
  Hour,
  Minute,
  Second,
  AmPm,
}

// Mapping from month index to days
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// Timestamp above which we should consider the time to be in milliseconds
export const MILLISECONDS_THRESHOLD = 99999999999;

function isLeapYear(year: number): boolean {
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

function getDaysInMonth(year: number, month: number): number {
    if (month == 1 && isLeapYear(year)) {
      return 29;
    } 
    return DAYS_IN_MONTH[month];
}

export function updateDate(initialDate: Date, component: DateComponent, utc: boolean, value: number): Date | null {
  let date = new Date(initialDate.valueOf());

  switch (component) {
    case DateComponent.Timestamp:
      if (value < 0 || value > 999999999999999) {
        return null;
      }
      const isMillis = value > MILLISECONDS_THRESHOLD;
      date.setTime(isMillis ? value : value * 1000);
      break;

    case DateComponent.Year:
      if (utc) {
        date.setUTCFullYear(value);
      } else {
        date.setFullYear(value);
      }
      break;

    case DateComponent.Month:
      if (value < 1 || value > 12) {
        return null;
      }
      if (utc) {
        date.setUTCMonth(value - 1);
      } else {
        date.setMonth(value - 1);
      }
      break;

    case DateComponent.Day:
      let year = utc ? initialDate.getUTCFullYear() : initialDate.getFullYear();
      let month = utc ? initialDate.getUTCMonth() : initialDate.getMonth();
      if (value <= 0 || value > getDaysInMonth(year, month)) {
        return null;
      }
      if (utc) {
        date.setUTCDate(value);
      } else {
        date.setDate(value);
      }
      break;

    case DateComponent.Hour:
      if (value < 1 || value > 12) {
        return null;
      }
      if (utc) {
        const isPm = date.getUTCHours() >= 12;
        date.setUTCHours(isPm ? value % 12 + 12 : value % 12);
      } else {
        const isPm = date.getHours() >= 12;
        date.setHours(isPm ? value % 12 + 12 : value % 12);
      }
      break;

    case DateComponent.Minute:
      if (value < 0 || value > 60) {
        return null;
      }
      if (utc) {
        date.setUTCMinutes(value);
      } else {
        date.setMinutes(value);
      }
      break;

    case DateComponent.Second:
      if (value < 0 || value > 60) {
        return null;
      }
      if (utc) {
        date.setUTCSeconds(value);
      } else {
        date.setSeconds(value);
      }
      break;

    case DateComponent.AmPm:
      const isPm = value === 1;
      if (utc) {
        if (isPm && date.getUTCHours() < 12) {
          date.setUTCHours(date.getUTCHours() + 12);
        } else if (!isPm && date.getUTCHours() >= 12) {
          date.setUTCHours(date.getUTCHours() - 12);
        }
      } else {
        if (isPm && date.getHours() < 12) {
          date.setHours(date.getHours() + 12);
        } else if (!isPm && date.getHours() >= 12) {
          date.setHours(date.getHours() - 12);
        }
      }
      break;
  }

  if (isNaN(date as any)) {
    return null;
  }
  return date;
}