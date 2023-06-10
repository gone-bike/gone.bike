export interface DateTimeFormatter {
  locale: string;
  date: Date;
  options?: Intl.DateTimeFormatOptions;
}

export function dateTimeFormatter({
  date,
  locale,
  options = {},
}: DateTimeFormatter) {
  if (!date || !locale) return;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
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
  numberOfUnits,
  unit = "days",
}: RelativeDateTimeFormatter) {
  if (!date || !locale) return;

  const defaultOptions: Intl.RelativeTimeFormatOptions = {
    numeric: "auto",
  };

  const newOptions = { ...defaultOptions, ...options };

  return new Intl.RelativeTimeFormat(locale, newOptions).format(
    numberOfUnits,
    unit
  );
}

export interface DateDiffInDays {
  startDate: Date;
  endDate?: Date;
}

export function dateDiffInDays({
  startDate,
  endDate = new Date(Date.now()),
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
