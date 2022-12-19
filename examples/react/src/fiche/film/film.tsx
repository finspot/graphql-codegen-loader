import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { useParams } from 'react-router-dom'

import { Layout } from '../../components/Layout/Layout'
import { LazyImage } from '../../components/LazyImage/LazyImage'
import { Poster } from '../../components/Poster/Poster'
import { WaitingPage } from '../../components/WaitingPage/WaitingPage'

import { useFilmQuery } from './film.graphql'

dayjs.extend(localizedFormat)

interface PersonProps {
  name: string
  role: string
}

const Person = ({ name, role }: PersonProps) => {
  const cacheKey = `person:${name}`

  const searchParams = new URLSearchParams()

  searchParams.set('query', name)

  return (
    <div className="w-20">
      <LazyImage
        cacheKey={cacheKey}
        className="aspect-square rounded-full w-full"
        searchParams={searchParams}
        imageClassName="grayscale object-top"
        resultKey="profile_path"
        url="search/person"
      />

      <footer className="mt-1 text-center text-sm">
        <div className="font-semibold text-slate-600">{name}</div>
        <div className="font-semibold text-slate-400">{role}</div>
      </footer>
    </div>
  )
}

export const Film = () => {
  const { id } = useParams()

  if (typeof id !== 'string') {
    throw new Error()
  }

  const { data, loading } = useFilmQuery({ variables: { id } })

  if (loading) {
    return <WaitingPage />
  }

  if (!data || !data.film) {
    throw new Error()
  }

  const { director, openingCrawl, producers, releaseDate, title } = data.film

  return (
    <Layout>
      <div className="items-center flex flex-col gap-8 max-w-4xl mx-auto px-4 md:flex-row md:items-start md:px-8">
        <div className="max-w-[290px] w-full md:flex-[1_0_auto]">
          <Poster releaseDate={releaseDate} title={title} />
        </div>

        <main className="md:w-[460px]">
          {title && <h1 className="font-semibold text-2xl text-slate-600">{title}</h1>}

          {releaseDate && (
            <div className="font-semibold text-2xl text-slate-400">{dayjs(releaseDate).format('LL')}</div>
          )}

          {openingCrawl && (
            <>
              <h2 className="font-semibold my-4 text-slate-600">Overview</h2>
              <p className="font-medium text-slate-500">{openingCrawl}</p>
            </>
          )}

          {director && (
            <>
              <h2 className="font-semibold my-4 text-slate-600">Director</h2>
              <Person name={director} role="Director" />
            </>
          )}

          {producers && producers.length > 0 && (
            <>
              <h2 className="font-semibold my-4 text-slate-600">Producers</h2>
              <ul className="flex gap-2">
                {producers.map(
                  producer =>
                    producer && (
                      <li key={producer}>
                        <Person name={producer} role="Producer" />
                      </li>
                    )
                )}
              </ul>
            </>
          )}
        </main>
      </div>
    </Layout>
  )
}
