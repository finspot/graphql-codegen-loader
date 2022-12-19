import groupBy from 'lodash/groupBy'

import type { Film } from '../types/film'

import { getYearCentury } from './getYearCentury'

export const getCenturies = (films: Film[]): string[] =>
  Object.keys(groupBy(films, ({ releaseDate }) => getYearCentury(releaseDate ?? 'unknown')))
    .filter(key => key !== 'unknown')
    .sort((yearA, yearB) => parseInt(yearA, 10) - parseInt(yearB, 10))
