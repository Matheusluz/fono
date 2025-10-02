"use client"

import FormInput from "@/src/components/FormInput"
import { useState } from "react"

export default function NewPatientPage() {
  const [form, setForm] = useState({ name: "", age: "", phone: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Novo paciente:", form)
    // chamada API para salvar paciente
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Cadastro de Paciente</h1>
        <FormInput
          label="Nome"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <FormInput
          label="Idade"
          type="number"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          required
        />
        <FormInput
          label="Telefone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
        >
          Salvar
        </button>
      </form>
    </main>
  )
}
