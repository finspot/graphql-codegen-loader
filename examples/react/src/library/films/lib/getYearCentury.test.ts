import { getYearCentury } from './getYearCentury'

describe('getYearCentury', () => {
  it('returns the century year', () => {
    expect(getYearCentury('1009-01-01')).toBe('1000')
    expect(getYearCentury('2009-01-01')).toBe('2000')
  })

  it('throws an error when input does not comply to a date format', () => {
    expect(() => getYearCentury('some invalid date')).toThrow()
  })
})
