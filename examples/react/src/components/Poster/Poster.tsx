import { LazyImage } from '../LazyImage/LazyImage'

interface PosterProps {
  releaseDate?: string | null
  title?: string | null
}

export const Poster = ({ releaseDate, title }: PosterProps) => {
  if (!releaseDate || !title) {
    return <LazyImage />
  }

  const cacheKey = `poster:${title}`
  const date = new Date(releaseDate)
  const searchParams = new URLSearchParams()

  searchParams.set('query', title)
  searchParams.set('year', date.getFullYear().toString())

  return <LazyImage cacheKey={cacheKey} searchParams={searchParams} resultKey="poster_path" url="search/movie" />
}
