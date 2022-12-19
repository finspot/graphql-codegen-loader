import { useSearchParams } from 'react-router-dom'

import { WaitingPage } from '../../components/WaitingPage/WaitingPage'

import { useFilmsQuery } from './films.graphql'
import { filterFilmsByCentury } from './lib/filterFilmsByCentury'
import { getCenturies } from './lib/getCenturies'
import { Library } from './views/Library/Library'

export const Films = () => {
  const { data, loading } = useFilmsQuery()

  const [searchParams] = useSearchParams()

  if (loading) {
    return <WaitingPage />
  }

  const activeYear = searchParams.get('century')
  const films = data?.allFilms?.films ?? []

  const centuries = getCenturies(filterFilmsByCentury(films, null))
  const filteredFilms = filterFilmsByCentury(films, activeYear)

  return <Library activeYear={activeYear} centuries={centuries} films={filteredFilms} />
}
