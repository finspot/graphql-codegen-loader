import type { Film } from '../types/film'

import { getYearCentury } from './getYearCentury'

export const filterFilmsByCentury = (films: Array<Film | null>, filteringYearCentury: string | null): Film[] =>
  films.filter((film): film is Film => {
    if (!film || !film.releaseDate) {
      return false
    }

    const yearCentury = getYearCentury(film.releaseDate)

    return filteringYearCentury === null || yearCentury === filteringYearCentury
  })
