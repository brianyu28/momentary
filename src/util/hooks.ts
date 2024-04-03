import { useState } from "react";
import { DateComponent, MILLISECONDS_THRESHOLD, updateDate } from "./date";

export interface DateData {
  // Data fields
  date: Date,
  timestampSecs: number,

  // User input fields 
  timestamp: string,

  // Is timestamp field in units of seconds or milliseconds
  timestampUnitsSecs: boolean,

  utcText: string,
  utcYear: string,
  utcMonth: string,
  utcDay: string,
  utcHours: string,
  utcMinutes: string,
  utcSeconds: string,
  utcPm: boolean,

  localText: string,
  localYear: string,
  localMonth: string,
  localDay: string,
  localHours: string,
  localMinutes: string,
  localSeconds: string,
  localPm: boolean,
}

const DATE_TEXT_OPTIONS = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  timeZoneName: "short",
};

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", DATE_TEXT_OPTIONS as any);
const UTC_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  ...DATE_TEXT_OPTIONS,
  timeZone: "UTC",
} as any);

export function useDateData(): [
  DateData,
  (component: DateComponent, utc: boolean, field: string, value: string) => void,
  () => void,
] {
  const [date, setDate] = useState<Date>(new Date());
  const [timestampUnitsSecs, setTimestampUnitsSecs] = useState<boolean>(true);

  // Sometimes the latest field will be an invalid value
  const [latestField, setLatestField] = useState<string | null>(null);
  const [latestFieldValue, setLatestFieldValue] = useState<string | null>(null);


  const timestampSecs = Math.floor(date.getTime() / 1000);
  const dateData = {
    date,
    timestampSecs,
    timestamp: timestampSecs.toString(),
    timestampUnitsSecs,

    utcText: UTC_DATE_FORMATTER.format(date),
    utcYear: date.getUTCFullYear().toString(),
    utcMonth: (date.getUTCMonth() + 1).toString(),
    utcDay: date.getUTCDate().toString(),
    utcHours: (date.getUTCHours() % 12 || 12).toString().padStart(2, "0"),
    utcMinutes: date.getUTCMinutes().toString().padStart(2, "0"),
    utcSeconds: date.getUTCSeconds().toString().padStart(2, "0"),
    utcPm: date.getUTCHours() >= 12,

    localText: DATE_FORMATTER.format(date),
    localYear: date.getFullYear().toString(),
    localMonth: (date.getMonth() + 1).toString(),
    localDay: date.getDate().toString(),
    localHours: (date.getHours() % 12 || 12).toString().padStart(2, "0"),
    localMinutes: date.getMinutes().toString().padStart(2, "0"),
    localSeconds: date.getSeconds().toString().padStart(2, "0"),
    localPm: date.getHours() >= 12,
    ...(latestField !== null ? {[latestField]: latestFieldValue ?? ""} : {}),
  };


  function setDateComponent(component: DateComponent, utc: boolean, field: string, value: string) {
    const valueNumber = component === DateComponent.AmPm ? (value === "PM" ? 1 : 0) : parseInt(value);
    if (isNaN(valueNumber)) {
      setLatestField(field);
      setLatestFieldValue(value);
      return;
    }
    const newDate = updateDate(date, component, utc, valueNumber);
    if (newDate === null || newDate.getTime() < 0) {
      setLatestField(field);
      setLatestFieldValue(value);
      return;
    }
    setTimestampUnitsSecs(!(component === DateComponent.Timestamp && valueNumber > MILLISECONDS_THRESHOLD));
    setDate(newDate);

    // For the timestamp field only, preserve whatever was typed
    setLatestField(field === "timestamp" ? "timestamp" : null);
    setLatestFieldValue(field === "timestamp" ? value : null);
  }

  function setToNow() {
    setDate(new Date());
    setTimestampUnitsSecs(true);
    setLatestField(null);
    setLatestFieldValue(null);
  }

  return [dateData, setDateComponent, setToNow];
}