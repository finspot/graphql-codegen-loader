import * as Types from '../../types/schema';
import * as Apollo from '@apollo/client';
export type FilmsQueryVariables = Types.Exact<{
    [key: string]: never;
}>;
export type FilmsQuery = {
    __typename?: 'Root';
    allFilms?: {
        __typename?: 'FilmsConnection';
        films?: Array<{
            __typename?: 'Film';
            director?: string | null;
            id: string;
            releaseDate?: string | null;
            title?: string | null;
        } | null> | null;
    } | null;
};
export declare const FilmsDocument: Apollo.DocumentNode;
/**
 * __useFilmsQuery__
 *
 * To run a query within a React component, call `useFilmsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFilmsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFilmsQuery({
 *   variables: {
 *   },
 * });
 */
export declare function useFilmsQuery(baseOptions?: Apollo.QueryHookOptions<FilmsQuery, FilmsQueryVariables>): Apollo.QueryResult<FilmsQuery, Types.Exact<{
    [key: string]: never;
}>>;
export declare function useFilmsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FilmsQuery, FilmsQueryVariables>): Apollo.LazyQueryResultTuple<FilmsQuery, Types.Exact<{
    [key: string]: never;
}>>;
export type FilmsQueryHookResult = ReturnType<typeof useFilmsQuery>;
export type FilmsLazyQueryHookResult = ReturnType<typeof useFilmsLazyQuery>;
export type FilmsQueryResult = Apollo.QueryResult<FilmsQuery, FilmsQueryVariables>;
