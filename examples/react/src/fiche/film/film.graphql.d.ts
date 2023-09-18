import * as Types from '../../types/schema';
import * as Apollo from '@apollo/client';
export type FilmBaseFragment = {
    __typename?: 'Film';
    director?: string | null;
    id: string;
    releaseDate?: string | null;
    title?: string | null;
};
export type FilmQueryVariables = Types.Exact<{
    id: Types.Scalars['ID'];
}>;
export type FilmQuery = {
    __typename?: 'Root';
    film?: {
        __typename?: 'Film';
        openingCrawl?: string | null;
        producers?: Array<string | null> | null;
        director?: string | null;
        id: string;
        releaseDate?: string | null;
        title?: string | null;
    } | null;
};
export declare const FilmBaseFragmentDoc: Apollo.DocumentNode;
export declare const FilmDocument: Apollo.DocumentNode;
/**
 * __useFilmQuery__
 *
 * To run a query within a React component, call `useFilmQuery` and pass it any options that fit your needs.
 * When your component renders, `useFilmQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFilmQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export declare function useFilmQuery(baseOptions: Apollo.QueryHookOptions<FilmQuery, FilmQueryVariables>): Apollo.QueryResult<FilmQuery, Types.Exact<{
    id: string;
}>>;
export declare function useFilmLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FilmQuery, FilmQueryVariables>): Apollo.LazyQueryResultTuple<FilmQuery, Types.Exact<{
    id: string;
}>>;
export type FilmQueryHookResult = ReturnType<typeof useFilmQuery>;
export type FilmLazyQueryHookResult = ReturnType<typeof useFilmLazyQuery>;
export type FilmQueryResult = Apollo.QueryResult<FilmQuery, FilmQueryVariables>;
