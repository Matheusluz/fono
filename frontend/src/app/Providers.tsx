"use client"
import { ReactNode } from 'react'
import { ApolloProvider } from '@apollo/client'
import client from '@/src/lib/apollo'
import { AuthProvider } from '@/src/context/AuthContext'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ApolloProvider>
  )
}
