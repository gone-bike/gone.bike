import config from "@utils/config";

export interface DateTimeFormatter {
  locale: string;
  date: Date;
  options?: Intl.DateTimeFormatOptions;
}

export function dateTimeFormatter({
  date,
  locale,
  options = {}
}: DateTimeFormatter) {
  if (!date || !locale) return;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  };

  const newOptions = { ...defaultOptions, ...options };

  return new Intl.DateTimeFormat(locale, newOptions).format(date);
}

export interface RelativeDateTimeFormatter {
  locale: string;
  date: Date;
  options?: Intl.RelativeTimeFormatOptions;
  numberOfUnits: number;
  unit?: Intl.RelativeTimeFormatUnit;
}

export function relativeDateTimeFormatter({
  date,
  locale,
  options = {},
  numberOfUnits: diffInDays
}: RelativeDateTimeFormatter) {
  if (!date || !locale) return;

  const defaultOptions: Intl.RelativeTimeFormatOptions = {
    numeric: "auto"
  };

  let appliedUnit: Intl.RelativeTimeFormatUnit = "day";

  const absolueDiffInDays = Math.abs(diffInDays);

  let finalUnitsValue = absolueDiffInDays;

  if (absolueDiffInDays >= config.RELATIVE_TIME_YEAR_IN_DAYS) {
    appliedUnit = "year";

    finalUnitsValue = Math.round(absolueDiffInDays / config.DAYS_IN_YEAR);
  } else if (absolueDiffInDays >= config.RELATIVE_TIME_MONTH_IN_DAYS) {
    appliedUnit = "month";
    finalUnitsValue = Math.round(absolueDiffInDays / config.DAYS_IN_MONTH);
  } else if (absolueDiffInDays >= config.RELATIVE_TIME_WEEK_IN_DAYS) {
    appliedUnit = "week";
    finalUnitsValue = Math.round(absolueDiffInDays / config.DAYS_IN_WEEK);
  }

  const newOptions = { ...defaultOptions, ...options };

  return new Intl.RelativeTimeFormat(locale, newOptions).format(
    -finalUnitsValue,
    appliedUnit
  );
}

export interface DateDiffInDays {
  startDate: Date;
  endDate?: Date;
}

export function dateDiffInDays({
  startDate,
  endDate = new Date(Date.now())
}: DateDiffInDays) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;

  // Discard the time and time-zone information.
  const utcStart = Date.UTC(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const utcEnd = Date.UTC(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );

  return Math.floor((utcStart - utcEnd) / _MS_PER_DAY);
}

export function getIsValidDate(d: Date) {
  return d instanceof Date && !isNaN(d as any);
}

const testDates = [
  new Date("1995-12-17T03:24:00"),
  new Date("2018-03-05T03:24:00"),
  new Date("2023-02-01T03:24:00"),
  new Date("2023-06-25T03:24:00"),
  new Date("2023-07-07T03:24:00")
];

const results = testDates.map((d) =>
  relativeDateTimeFormatter({
    date: d,
    locale: "en",
    numberOfUnits: dateDiffInDays({ startDate: d })
  })
);

console.table(results);
