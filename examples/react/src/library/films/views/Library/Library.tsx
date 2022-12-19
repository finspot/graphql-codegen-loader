import { Link } from 'react-router-dom'

import { Layout } from '../../../../components/Layout/Layout'
import { Poster } from '../../../../components/Poster/Poster'
import { NavItem } from '../../components/NavItem/NavItem'
import type { Film } from '../../types/film'

interface LibraryProps {
  activeYear: string | null
  centuries: string[]
  films: Film[]
}

export const Library = ({ activeYear, centuries, films }: LibraryProps) => (
  <Layout>
    <h1 className="font-bold mb-10 text-4xl text-center">Star Wars</h1>

    <nav className="mb-8">
      <ul className="flex justify-center">
        <NavItem href="/" isSelected={activeYear === null}>
          All
        </NavItem>

        {centuries.map(century => (
          <NavItem key="century" href={`/?century=${century}`} isSelected={activeYear === century}>
            {century}s
          </NavItem>
        ))}
      </ul>
    </nav>

    <div>
      <ul className="gap-4 grid grid-cols-2 max-w-5xl mx-auto px-4 md:px-8 sm:grid-cols-3 md:gap-8 md:grid-cols-4 lg:grid-cols-5">
        {films.map(({ director, id, releaseDate, title }) => (
          <li key={id}>
            <Link to={`/films/${id}`}>
              <article>
                <Poster releaseDate={releaseDate} title={title} />

                {title && (
                  <footer className="mt-3">
                    <div className="font-semibold text-slate-600">{title}</div>
                    <div className="font-semibold text-slate-400">{director}</div>
                  </footer>
                )}
              </article>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </Layout>
)
