# @pretto/graphql-codegen-loader

[![npm version](https://img.shields.io/npm/v/@pretto/graphql-codegen-loader.svg?style=flat)](https://www.npmjs.com/package/@pretto/graphql-codegen-loader)

A [Webpack](https://webpack.js.org/) [loader](https://webpack.js.org/loaders/) to seamlessly integrate [GraphQL Code Generator](https://the-guild.dev/graphql/codegen) into your development workflow.

## Table of contents

- [Installation](#installation)
- [Introduction](#introduction)
- [Options](#options)
- [Usage](#usage)
- [Example](#example)

## Installation

```sh
yarn add graphql typescript
yarn add --dev @pretto/graphql-codegen-loader
```

## Introduction

<ins>graphql-codegen-loader</ins> works like any other loader. You define the test pattern for which file path you want the loader to be run, and then specify what other loader you want to be run next before the result is being handled back to the bundler. <ins>graphql-codegen-loader</ins> outputs a Typescript result so it's important that you run that result through another loader that makes it understandable to the bundler. By default, Webpack does not understand Typescript. In this documentation, I'll be using [babel](https://babeljs.io/) as a Typescript compiler but you may use whatever compiler your may like.

**Example**

```js
const path = require('path')

module.exports = {
  entry: path.join(__dirname, 'src/index'),

  mode: 'development',

  module: {
    rules: [
      {
        oneOf: [
          {
            exclude: /node_modules/,
            test: /\.gql$/,
            use: [
              { loader: 'babel-loader', options: { presets: ['@babel/preset-typescript'] } },
              {
                loader: '@pretto/graphql-codegen-loader',
                options: {
                  schema: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
                  schemaTypesPath: path.join(__dirname, 'src/types'),
                },
              },
            ],
          },
        ],
      },
    ],
  },

  output: {
    publicPath: '/',
  },

  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
}
```

## Options

**Root**

| Name             | Type                  | Required | Default value   | Description |
|------------------|-----------------------|----------|-----------------|-------------|
| emitFiles        | `boolean`             | ❌       | `false`         | If true, <ins>graphql-codegen-loader</ins> will generate a declaration file beside all imported document files (see. [Bare usage](#bare-usage)) |
| plugins          | `(Plugin \| string)[]` | ❌       | `[]`           | Plugins to be added to the GraphQl Code Generator configuration (cf. [plugins](https://the-guild.dev/graphql/codegen/plugins)). |
| schema           | `string`              | ✅       | N/A             | GraphQL schema (cf. [schema field](https://the-guild.dev/graphql/codegen/docs/config-reference/schema-field)). |
| schemaTypesPath  | `string`              | ✅       | N/A             | Folder where the default types will be added. During compile time, <ins>graphql-codegen-loader</ins> will generate a declaration file for all your schema types (interfaces, scalars...): **schema.d.ts**. If your schema contains enums, it will also generate a Typescript file: **enums.ts**, to refer to enums (as a type and as a value) in your application. |
| typescriptConfig | `string`              | ❌       | `tsconfig.json` | Path to your Typescript configuration file. |
| useWorkspaces    | `boolean`             | ❌       | `false`         | If true, all the generated files will refer to other files using the `@workspace/` syntax instead of a relative import. |

**Plugin**

| Name    | Type   | Required | Default value | Description |
|---------|--------|----------|---------------|-------------|
| options | object | ❌       | {}            | Plugin's options. |
| plugin  | string | ✅       | N/A           | Plugin's name. |

## Usage

Now that we cover the options API, let's see how to use the loader in different contexts. As we said, <ins>graphql-codegen-loader</ins> is a wrapper around GraphQL Code Generator, and without additional configuration, what it does is very minimal:

- It tells Webpack how to read a GraphQL file, running this file through the GraphQL Code Generator with for only plugin: [typescript-operations](https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-operations). **Which basically, does nothing but exporting Typescript types.**

#### Bare usage

Let's consider the following configuration:

```js
// webpack.config.js
{
  schema: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
  schemaTypesPath: path.join(__dirname, 'src/types'),
}
```

```gql
# films.gql
query Films {
  allFilms {
    films {
      director
      id
      releaseDate
      title
    }
  }
}
```

```ts
// index.ts
import { FilmsQuery } from './films.gql'
// FilmsQuery is a type
```

Here, `FilmsQuery` is a type that could be use to type data coming from a corresponding GraphQL request but at the end of the day, nothing will be procuded by Webpack. **What we have here is just for typing purposes.** At this point, **you'll even get a error from your IDE** because it does not know how to read `*.gql` files. That is where the `emitFiles` options comes to the rescue. Let's adjust the Webpack configuration a tiny bit:

```diff
// webpack.config.js
{
+ emitFiles: true,
  schema: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
  schemaTypesPath: path.join(__dirname, 'src/types'),
}
```

This comes very handy. It generates 2 files:

- A declaration file containing all schema types (interfaces, scalars...). Its location depends on the `schemaTypesPath` option.
- A declaration file beside all imported files, in our case:

```ts
// films.gql.d.ts
import * as Types from '../../types/schema';
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
```

From now on, your IDE should be able to understand `*.gql` imports, and your type checking should not throw any errors.

#### Generic usage

Here, we're going to use GraphQL Code Generator plugin [Typescript Generic SDK](https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-generic-sdk) to illustrate how to perform a GraphQL request and type the output using NO framework at all. Let's consider the following configuration:

```js
// webpack.config.js
{
  emitFiles: true,
  plugins: ['typescript-generic-sdk'],
  schema: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
  schemaTypesPath: path.join(__dirname, 'src/types'),
}
```

```ts
// index.ts
import { DocumentNode } from 'graphql'
import { print } from 'graphql/language/printer'
import { useEffect, useState } from 'react'

import { FilmsDocument, FilmsQuery } from './films.gql'

const request = async <T,>(document: DocumentNode): Promise<T> => {
  const query = print(document)

  const response = await fetch('https://swapi-graphql.netlify.app/.netlify/functions/index', {
    body: JSON.stringify({ query }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })

  const result = await response.json()

  return result
}

const useGraphQL = <T,>(document: DocumentNode) => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setIsLoading] = useState(true)

  useEffect(() => {
    request<T>(document)
      .then(setData)
      .catch(setError)
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return { data, error, loading }
}

export const Films = () => {
  const { data, loading } = useGraphQL<FilmsQuery>(FilmsDocument)
  // data is of type FilmsQuery | null

  return null
}
```

Works like a charm!
Looks familiar though? Yep, let's see how we could save some time here.

#### React Apollo usage

Here, we're going to use GraphQL Code Generator plugin [Typescript React Apollo]([https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-generic-sdk](https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-react-apollo)) to illustrate how to perform a GraphQL request and type the output using [@apollo/client](https://www.apollographql.com/docs/react/). Let's consider the following configuration:

```js
// webpack.config.js
{
  emitFiles: true,
  plugins: ['typescript-react-apollo'],
  schema: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
  schemaTypesPath: path.join(__dirname, 'src/types'),
}
```

```ts
// index.ts
import { useQuery } from '@apollo/client'

import { FilmsDocument, FilmsQuery } from './films.gql'

export const Films = () => {
  const { data, loading } = useQuery<FilmsQuery>(FilmsDocument)
  // data is of type FilmsQuery | undefined

  return null
}
```

Same as our generic example but very much simpler! Even cooler, by default the **React Apollo plugin exports custom hooks** to save more time:

```ts
// index.ts
export const Films = () => {
  const { data, loading } = useFilmsQuery()
  // data is of type FilmsQuery | undefined

  return null
}
```

Isn't it awesome?
But this is could be disabled by passing option to the plugin, let's see how by adjusing the Webpack configuration:

```diff
// webpack.config.js
{
  emitFiles: true,
- plugins: ['typescript-react-apollo'],
+ plugins: [{ plugin: 'typescript-react-apollo', options: { withHooks: false } }],
  schema: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
  schemaTypesPath: path.join(__dirname, 'src/types'),
}
```

#### Other usage

There are many possible use cases by using the amazing GraphQL Code Generator [plugins](https://the-guild.dev/graphql/codegen/plugins) and even combining them together:

- [Vue Apollo](https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-vue-apollo)
- [Svelte Apollo](https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-svelte-apollo)
- and more...

## Example

This repository comes with a working example using React Apollo. [Give it a try!](example/react)
