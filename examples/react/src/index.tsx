import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Film } from './fiche/film/film'
import './index.css'
import { Films } from './library/films/films'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
})

const App = () => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <Routes>
        <Route element={<Films />} path="/" />
        <Route element={<Film />} path="/films/:id" />
      </Routes>
    </BrowserRouter>
  </ApolloProvider>
)

const container = document.getElementById('container')

if (container) {
  const root = createRoot(container)

  root.render(<App />)
}
