import { SupportedTimezones } from '@/payload-types'

/** locale options for Month D, YYYY
 * @param timeZone timezone
 * @returns Locale object Month D, YYYY
 */
export const localeOptionsMonthDayYear = (
  timeZone?: SupportedTimezones
): Intl.DateTimeFormatOptions => {
  return {
    timeZone: timeZone || 'America/New_York',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }
}

/** locale options for Time only: HH:MM
 * @param timeZone timezone
 * @returns Locale object HH:MM
 */
export const localeOptionsTimeOnly = (
  timeZone?: SupportedTimezones
): Intl.DateTimeFormatOptions => {
  return {
    timeZone: timeZone || 'America/New_York',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'shortGeneric',
  }
}

/** locale options for M/D/YYYY
 * @param timeZone timezone
 * @returns Locale object M/D/YYYY
 */
export const localeOptionsMDY = (
  timeZone?: SupportedTimezones
): Intl.DateTimeFormatOptions => {
  return {
    timeZone: timeZone || 'America/New_York',
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  }
}

/** locale options for Month YYYY
 * @param timeZone timezone
 * @returns Locale object Month YYYY
 */
export const localeOptionsMonthYear = (
  timeZone?: SupportedTimezones
): Intl.DateTimeFormatOptions => {
  return {
    timeZone: timeZone || 'America/New_York',
    month: 'long',
    year: 'numeric',
  }
}

/** Convert a Date Object
 * @param date Date or DateString that can be converted to Date object
 * @param options Locale Options
 * @returns Date based on Locale Object
 */
export const convertDate = (date: Date | string, options: Intl.DateTimeFormatOptions) => {
  if (typeof date === 'string') {
    return new Date(date).toLocaleDateString('en-US', options)
  }
  return date.toLocaleDateString('en-US', options)
}

/** Convert a Date Object to Month D, YYYY
 * @param date Date or DateString that can be converted to Date object
 * @param timeZone time zone optional
 * @returns Month D, YYYY based on Date Object or Date String
 */
export const dateToLong = (
  date: Date | string,
  timeZone?: SupportedTimezones
): string => {
  return convertDate(date, localeOptionsMonthDayYear(timeZone))
}

/** Convert a Date Object to M/D/YYYY
 * @param date Date or DateString that can be converted to Date object
 * @param timeZone time zone optional
 * @returns M/D/YYYY based on Date Object or Date String
 */
export const dateToNumeric = (
  date: Date | string,
  timeZone?: SupportedTimezones
): string => {
  return convertDate(date, localeOptionsMDY(timeZone))
}

/** Convert a Date Object to Time Only (HH:MM am/pm)
 * @param date Date or DateString that can be converted to Date object
 * @param timeZone time zone optional
 * @returns HH:MM am/pm and short time zone
 */
export const timeOnly = (date: Date | string, timeZone?: SupportedTimezones): string => {
  if (typeof date === 'string') {
    return new Date(date).toLocaleTimeString('en-US', localeOptionsTimeOnly(timeZone))
  }
  return date.toLocaleTimeString('en-US', localeOptionsTimeOnly(timeZone))
}

/** Convert a Date Object to ISO standard
 * @param date Date or DateString that can be converted to Date object
 * @returns an ISO formatted date/time string
 */
export const dateISO = (date: string): string => {
  return date.split('T')[0]
}

/** Convert a Date Object to Month YYYY
 * @param date Date or DateString that can be converted to Date object
 * @param timeZone timezone name
 * @returns Month YYYY styled date string
 */
export const dateMonthYear = (
  date: Date | string,
  timeZone?: SupportedTimezones
): string => {
  return convertDate(date, localeOptionsMonthYear(timeZone))
}
