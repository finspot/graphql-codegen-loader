import type { FilmsQuery } from '../films.graphql'

export type Film = NonNullable<NonNullable<NonNullable<FilmsQuery['allFilms']>['films']>[0]>
