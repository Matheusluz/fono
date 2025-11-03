"use client"
import { useEffect } from 'react'
import { useAuth } from '@/src/context/AuthContext'
import LoginForm from '@/src/components/LoginForm'
import { useRouter } from 'next/navigation'

export default function Root() {
  const { token } = useAuth()
  const router = useRouter()

  // Se já estiver autenticado, mandar para /home
  useEffect(() => {
    if (token) {
      router.replace('/home')
    }
  }, [token, router])

  // Se não autenticado, mostrar a tela de login diretamente
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginForm />
    </main>
  )
}
