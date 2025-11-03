"use client"

import { useEffect } from 'react'
import { useAuth } from '@/src/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const { user, logout, loading, token } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !token) {
      router.replace('/login')
    }
  }, [loading, token, router])

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center">Carregando...</main>
  }

  if (!user) {
    return null // redirecionando
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Bem-vindo!</h1>
        <p className="mb-2">ID: {user.id}</p>
        <p className="mb-2">Email: {user.email}</p>
        <p className="mb-6">Admin: {user.admin ? 'Sim' : 'Não'}</p>
        <div className="flex gap-4">
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Sair
          </button>
        </div>
      </div>
    </main>
  )
}
