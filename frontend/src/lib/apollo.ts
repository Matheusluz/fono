import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

// Ajustar porta padrão do backend (3001) se variável de ambiente não estiver definida
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql',
})

// Link de autenticação - adiciona token JWT ao header
const authLink = setContext((_, { headers }) => {
  // Pegar o token do localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
})

// Link de tratamento de erros - limpa token inválido e redireciona para login
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions }) => {
      console.error('[GraphQL error]:', message)
      
      // Se erro de autenticação (token inválido/expirado)
      if (
        message.includes('Not authenticated') ||
        message.includes('Invalid token') ||
        message.includes('Token expired') ||
        message.includes('Signature verification failed') ||
        extensions?.code === 'UNAUTHENTICATED'
      ) {
        // Limpar token inválido
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          
          // Redirecionar para login apenas se não estiver já na página de login
          if (!window.location.pathname.includes('/login')) {
            console.log('Token inválido detectado. Redirecionando para login...')
            window.location.href = '/login'
          }
        }
      }
    })
  }
  
  if (networkError) {
    console.error('[Network error]:', networkError)
  }
})

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
})

export default client
