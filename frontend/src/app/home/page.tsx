"use client"

import { useAuth } from '@/src/context/AuthContext'
import DashboardLayout from '@/src/components/DashboardLayout'
import ProtectedRoute from '@/src/components/ProtectedRoute'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo ao sistema de gerenciamento</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total de Pacientes</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
          <div className="mt-4 text-xs text-green-600">
            ↗ Em breve
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Atendimentos Hoje</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Nenhum agendamento
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Usuários Ativos</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
            <div className="text-4xl">👤</div>
          </div>
          <div className="mt-4 text-xs text-blue-600">
            Você está online
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Relatórios</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Nenhum gerado
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Atividades Recentes</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-12 text-gray-500">
              <p className="text-4xl mb-2">📋</p>
              <p>Nenhuma atividade registrada ainda</p>
              <p className="text-sm mt-2">As ações do sistema aparecerão aqui</p>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Minha Conta</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900 truncate">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">ID do Usuário</p>
              <p className="font-medium text-gray-900">{user?.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tipo de Conta</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                user?.admin
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {user?.admin ? 'Administrador' : 'Usuário Padrão'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <span className="text-2xl">➕</span>
            <div className="text-left">
              <p className="font-medium text-gray-900">Novo Paciente</p>
              <p className="text-sm text-gray-600">Cadastrar novo paciente</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <span className="text-2xl">📅</span>
            <div className="text-left">
              <p className="font-medium text-gray-900">Agendar</p>
              <p className="text-sm text-gray-600">Nova consulta</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <span className="text-2xl">📊</span>
            <div className="text-left">
              <p className="font-medium text-gray-900">Relatório</p>
              <p className="text-sm text-gray-600">Gerar novo relatório</p>
            </div>
          </button>
        </div>
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  )
}
