"use client"
import { ReactNode } from 'react'
import { ApolloProvider } from '@apollo/client'
import client from '@/src/lib/apollo'
import { AuthProvider } from '@/src/context/AuthContext'
import { ThemeProvider } from '@/src/context/ThemeContext'
import ErrorBoundary from '@/src/components/ErrorBoundary'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <ApolloProvider client={client}>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </ApolloProvider>
    </ErrorBoundary>
  )
}
