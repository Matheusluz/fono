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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">Bem-vindo ao sistema de gerenciamento</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/30 border dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total de Pacientes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
          <div className="mt-4 text-xs text-green-600 dark:text-green-400">
            ↗ Em breve
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/30 border dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Atendimentos Hoje</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Nenhum agendamento
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/30 border dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Usuários Ativos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1</p>
            </div>
            <div className="text-4xl">👤</div>
          </div>
          <div className="mt-4 text-xs text-blue-600 dark:text-blue-400">
            Você está online
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/30 border dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Relatórios</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Nenhum gerado
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/30 border dark:border-gray-700">
          <div className="p-6 border-b dark:border-gray-600">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Atividades Recentes</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="text-4xl mb-2">📋</p>
              <p>Nenhuma atividade registrada ainda</p>
              <p className="text-sm mt-2">As ações do sistema aparecerão aqui</p>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/30 border dark:border-gray-700">
          <div className="p-6 border-b dark:border-gray-600">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Minha Conta</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">ID do Usuário</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{user?.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tipo de Conta</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                user?.admin
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}>
                {user?.admin ? 'Administrador' : 'Usuário Padrão'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/30 border dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            <span className="text-2xl">➕</span>
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-gray-100">Novo Paciente</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cadastrar novo paciente</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            <span className="text-2xl">📅</span>
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-gray-100">Agendar</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Nova consulta</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            <span className="text-2xl">📊</span>
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-gray-100">Relatório</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gerar novo relatório</p>
            </div>
          </button>
        </div>
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  )
}
