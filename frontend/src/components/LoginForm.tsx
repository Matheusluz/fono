"use client"
import { useState } from 'react'
import FormInput from '@/src/components/FormInput'
import { useAuth } from '@/src/context/AuthContext'

export default function LoginForm() {
  const { login, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await login(email, password)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      <FormInput
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <FormInput
        label="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="text-red-600 text-sm mb-4" role="alert">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 disabled:opacity-50 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        {loading ? 'Autenticando...' : 'Entrar'}
      </button>
    </form>
  )
}
