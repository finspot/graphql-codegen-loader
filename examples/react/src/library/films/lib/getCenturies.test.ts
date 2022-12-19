import type { Film } from '../types/film'

import { getCenturies } from './getCenturies'

describe('getCenturies', () => {
  it('returns the centuries ordered', () => {
    const films: Film[] = [
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

    expect(getCenturies([])).toEqual([])
    expect(getCenturies(films)).toEqual(['1980', '1990', '2000'])
  })

  it('throws an error when input does not comply to a date format', () => {
    const films: Film[] = [
      {
        director: 'George Lucas',
        id: 'ZmlsbXM6NA==',
        releaseDate: 'some invalid date',
        title: 'The Phantom Menace',
      },
    ]

    expect(() => getCenturies(films)).toThrow()
  })
})
