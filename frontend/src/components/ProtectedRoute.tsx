"use client"

import { useEffect } from 'react'
import { useAuth } from '@/src/context/AuthContext'
import { useRouter } from 'next/navigation'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'professional' | 'assistant'
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading, token } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !token) {
      router.replace('/')
    }
  }, [loading, token, router])

  // Verifica role se especificado
  useEffect(() => {
    if (!loading && user && requiredRole && user.role !== requiredRole && user.role !== 'admin') {
      // Admin tem acesso a tudo, outros roles precisam ter o role específico
      router.replace('/home')
    }
  }, [loading, user, requiredRole, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
