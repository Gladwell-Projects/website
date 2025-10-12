import { SupportedTimezones } from '@/payload-types'

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
export const localeOptionsMonthYear = (
  timeZone?: SupportedTimezones
): Intl.DateTimeFormatOptions => {
  return {
    timeZone: timeZone || 'America/New_York',
    month: 'numeric',
    year: 'numeric',
  }
}

export const convertDate = (date: Date | string, options: Intl.DateTimeFormatOptions) => {
  if (typeof date === 'string') {
    return new Date(date).toLocaleDateString('en-US', options)
  }
  return date.toLocaleDateString('en-US', options)
}

export const dateToLong = (
  date: Date | string,
  timeZone?: SupportedTimezones
): string => {
  return convertDate(date, localeOptionsMonthDayYear(timeZone))
}

export const dateToNumeric = (
  date: Date | string,
  timeZone?: SupportedTimezones
): string => {
  return convertDate(date, localeOptionsMDY(timeZone))
}

export const timeOnly = (date: Date | string, timeZone?: SupportedTimezones): string => {
  if (typeof date === 'string') {
    return new Date(date).toLocaleTimeString('en-US', localeOptionsTimeOnly(timeZone))
  }
  return date.toLocaleTimeString('en-US', localeOptionsTimeOnly(timeZone))
}

export const dateISO = (date: string): string => {
  return date.split('T')[0]
}

export const dateMonthYear = (
  date: Date | string,
  timeZone?: SupportedTimezones
): string => {
  return convertDate(date, localeOptionsMonthYear(timeZone))
}
