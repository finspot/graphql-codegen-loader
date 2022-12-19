import classnames from 'classnames'
import { useEffect, useState } from 'react'

interface Cache {
  [key: string]: string
}

const cache = {
  __cache: {} as Cache,

  get(key: string | null | undefined): string | null {
    if (!key) {
      return null
    }

    return this.__cache[key] ?? null
  },

  set(key: string, value: string) {
    this.__cache[key] = value
  },
}

interface LazyImageProps extends React.HTMLAttributes<HTMLDivElement> {
  cacheKey?: string
  className?: string
  imageClassName?: string
  resultKey?: string
  searchParams?: URLSearchParams
  url?: string
}

export const LazyImage = ({ cacheKey, className, imageClassName, resultKey, searchParams, url }: LazyImageProps) => {
  const cachedValue = cache.get(cacheKey)

  const [isVisible, setIsVisible] = useState(cachedValue !== null)
  const [src, setSrc] = useState<string | null>(cachedValue)

  useEffect(() => {
    if (cachedValue !== null || !url || !resultKey) {
      return
    }

    init(url, resultKey, searchParams)
      .then(url => {
        setSrc(url)

        if (cacheKey) {
          cache.set(cacheKey, url)
        }
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error(error)
      })
  }, [])

  const init = async (url: string, resultKey: string, searchParams?: URLSearchParams) => {
    const apiUrl = new URL(url, 'https://api.themoviedb.org/3/')

    apiUrl.searchParams.set('api_key', '15d2ea6d0dc1d476efbca3eba2b9bbfb')
    apiUrl.searchParams.set('include_adult', false.toString())

    if (searchParams) {
      searchParams.forEach((value, key) => {
        apiUrl.searchParams.set(key, value)
      })
    }

    const response = await fetch(apiUrl.toString())

    if (!response.ok) {
      throw new Error()
    }

    const {
      results: [{ [resultKey]: image }],
    } = await response.json()

    return `http://image.tmdb.org/t/p/w500${image}`
  }

  if (!src) {
    return <div className={classnames('aspect-[2/3] bg-slate-200 rounded-lg', className)} />
  }

  const handleLoad = () => {
    setIsVisible(true)
  }

  return (
    <div className={classnames('aspect-[2/3] bg-slate-200 overflow-hidden relative rounded-lg', className)}>
      <img
        className={classnames(
          'absolute ease-out duration-300 h-full left-0 object-cover opacity-0 top-0 w-full',
          {
            'opacity-100': isVisible,
          },
          imageClassName
        )}
        loading="lazy"
        onLoad={handleLoad}
        src={src}
      />
    </div>
  )
}
