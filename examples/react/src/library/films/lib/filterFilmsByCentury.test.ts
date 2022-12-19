import type { Film } from '../types/film'

import { filterFilmsByCentury } from './filterFilmsByCentury'

describe('filterFilmsByCentury', () => {
  it('returns the filtered films by given century', () => {
    const input: Film[] = [
      {
        director: 'George Lucas',
        id: 'ZmlsbXM6NA==',
        releaseDate: '1999-05-19',
        title: 'The Phantom Menace',
      },
      {
        director: 'Irvin Kershner',
        id: 'ZmlsbXM6Mg==',
        releaseDate: '1980-05-17',
        title: 'The Empire Strikes Back',
      },
      {
        director: 'George Lucas',
        id: 'ZmlsbXM6NQ==',
        releaseDate: '2002-05-16',
        title: 'Attack of the Clones',
      },
      {
        director: 'Richard Marquand',
        id: 'ZmlsbXM6Mw==',
        releaseDate: '1983-05-25',
        title: 'Return of the Jedi',
      },
    ]

    const output: Film[] = [
      {
        director: 'Irvin Kershner',
        id: 'ZmlsbXM6Mg==',
        releaseDate: '1980-05-17',
        title: 'The Empire Strikes Back',
      },
      {
        director: 'Richard Marquand',
        id: 'ZmlsbXM6Mw==',
        releaseDate: '1983-05-25',
        title: 'Return of the Jedi',
      },
    ]

    expect(filterFilmsByCentury([], '1000')).toEqual([])
    expect(filterFilmsByCentury(input, '1000')).toEqual([])
    expect(filterFilmsByCentury(input, '1980')).toEqual(output)
    expect(filterFilmsByCentury(input, null)).toEqual(input)
  })

  it('throws an error when input does not comply to a date format', () => {
    const input: Film[] = [
      {
        director: 'George Lucas',
        id: 'ZmlsbXM6NA==',
        releaseDate: 'some invalid date',
        title: 'The Phantom Menace',
      },
    ]

    expect(() => filterFilmsByCentury(input, null)).toThrow()
  })
})
