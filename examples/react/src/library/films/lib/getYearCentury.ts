import dayjs from 'dayjs'

export const getYearCentury = (date: string): string => {
  const ddate = dayjs(date)

  if (!ddate.isValid()) {
    throw new Error('Invalid date')
  }

  return (Math.floor(ddate.year() / 10) * 10).toString()
}
