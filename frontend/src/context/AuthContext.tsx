"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useApolloClient, gql } from '@apollo/client'

interface User {
  id: string
  email: string
  admin: boolean
}

interface AuthContextValue {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// GraphQL definitions kept local to avoid circular imports
const LOGIN_USER_MUTATION = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      user { id email admin }
      token
      errors
    }
  }
`

const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser { id email admin }
  }
`

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const apollo = useApolloClient()

  // Initialize from localStorage
  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (storedToken) {
      // Verificar se token está expirado (JWT format: header.payload.signature)
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]))
        const exp = payload.exp * 1000 // converter para milliseconds
        
        // Se token expirado, limpar
        if (Date.now() >= exp) {
          console.log('Token expirado detectado. Limpando...')
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setLoading(false)
          return
        }
      } catch (e) {
        // Token inválido, limpar
        console.error('Token inválido:', e)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setLoading(false)
        return
      }
      
      setToken(storedToken)
      // Fetch current user
      apollo.query({ query: CURRENT_USER_QUERY, fetchPolicy: 'network-only' })
        .then(res => {
          setUser(res.data.currentUser)
        })
        .catch((error) => {
          // invalid token
          console.error('Erro ao buscar usuário atual:', error)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setToken(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [apollo])

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await apollo.mutate({
        mutation: LOGIN_USER_MUTATION,
        variables: { email, password }
      })
      const payload = result.data?.loginUser
      if (payload?.token && payload.user && payload.errors.length === 0) {
        localStorage.setItem('token', payload.token)
        // Set cookie for middleware (simple non-secure cookie for dev)
        document.cookie = `token=${payload.token}; path=/;`
        setToken(payload.token)
        setUser(payload.user)
        router.replace('/home')
      } else {
        throw new Error(payload?.errors?.join(', ') || 'Falha no login')
      }
    } finally {
      setLoading(false)
    }
  }, [apollo, router])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    // Remove cookie
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;'
    setToken(null)
    setUser(null)
    router.replace('/login')
  }, [router])

  const value: AuthContextValue = { user, token, loading, login, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
