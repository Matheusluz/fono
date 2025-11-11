'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { 
  PROFESSIONALS_QUERY, 
  CREATE_PROFESSIONAL_MUTATION, 
  UPDATE_PROFESSIONAL_MUTATION, 
  DELETE_PROFESSIONAL_MUTATION,
  USERS_QUERY
} from '@/src/lib/graphql'
import { useRouter } from 'next/navigation'

interface Professional {
  id: string
  userId: string
  email: string
  fullName: string
  specialty: string
  councilRegistration: string | null
  bio: string | null
  active: boolean
}

interface User {
  id: string
  email: string
  role: string
}

const SPECIALTIES = [
  'Fonoaudiologia',
  'Psicologia',
  'Psicopedagogia',
  'Terapia Ocupacional',
  'Nutrição',
  'Fisioterapia'
]

export default function ProfessionalsPage() {
  const router = useRouter()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)
  const [formData, setFormData] = useState({
    userId: '',
    specialty: '',
    councilRegistration: '',
    bio: ''
  })

  // Queries
  const { data, loading, error, refetch } = useQuery(PROFESSIONALS_QUERY, {
    variables: { includeInactive: false }
  })
  
  const { data: usersData } = useQuery(USERS_QUERY)

  // Mutations
  const [createProfessional] = useMutation(CREATE_PROFESSIONAL_MUTATION, {
    onCompleted: () => {
      refetch()
      setShowCreateModal(false)
      resetForm()
    },
    onError: (error) => alert(error.message)
  })

  const [updateProfessional] = useMutation(UPDATE_PROFESSIONAL_MUTATION, {
    onCompleted: () => {
      refetch()
      setShowEditModal(false)
      resetForm()
    },
    onError: (error) => alert(error.message)
  })

  const [deleteProfessional] = useMutation(DELETE_PROFESSIONAL_MUTATION, {
    onCompleted: () => {
      refetch()
      setShowDeleteModal(false)
    },
    onError: (error) => alert(error.message)
  })

  const resetForm = () => {
    setFormData({ userId: '', specialty: '', councilRegistration: '', bio: '' })
    setSelectedProfessional(null)
  }

  const handleCreate = () => {
    setShowCreateModal(true)
    resetForm()
  }

  const handleEdit = (professional: Professional) => {
    setSelectedProfessional(professional)
    setFormData({
      userId: professional.userId,
      specialty: professional.specialty,
      councilRegistration: professional.councilRegistration || '',
      bio: professional.bio || ''
    })
    setShowEditModal(true)
  }

  const handleDelete = (professional: Professional) => {
    setSelectedProfessional(professional)
    setShowDeleteModal(true)
  }

  const submitCreate = () => {
    createProfessional({
      variables: {
        userId: formData.userId,
        specialty: formData.specialty,
        councilRegistration: formData.councilRegistration || null,
        bio: formData.bio || null
      }
    })
  }

  const submitUpdate = () => {
    if (!selectedProfessional) return
    updateProfessional({
      variables: {
        id: selectedProfessional.id,
        specialty: formData.specialty,
        councilRegistration: formData.councilRegistration || null,
        bio: formData.bio || null
      }
    })
  }

  const submitDelete = () => {
    if (!selectedProfessional) return
    deleteProfessional({
      variables: { id: selectedProfessional.id }
    })
  }

  // Filtrar apenas usuários que NÃO são profissionais ainda
  const availableUsers = usersData?.users?.filter((user: User) => 
    user.role !== 'professional' || !data?.professionals?.some((p: Professional) => p.userId === user.id)
  ) || []

  if (loading) return <div className="p-8">Carregando profissionais...</div>
  if (error) return <div className="p-8 text-red-600">Erro: {error.message}</div>

  const professionals: Professional[] = data?.professionals || []

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Profissionais</h1>
          <button
            onClick={handleCreate}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            + Adicionar Profissional
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profissional</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especialidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {professionals.map((professional) => (
                <tr key={professional.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{professional.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                          {professional.email.substring(0, 2).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{professional.fullName}</div>
                        <div className="text-sm text-gray-500">{professional.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      {professional.specialty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {professional.councilRegistration || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      professional.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {professional.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(professional)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(professional)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Desativar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Total: <span className="font-semibold">{professionals.length}</span> profissionais ativos
            </div>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Adicionar Profissional</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuário <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecione um usuário</option>
                  {availableUsers.map((user: User) => (
                    <option key={user.id} value={user.id}>
                      {user.email} ({user.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidade <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecione uma especialidade</option>
                  {SPECIALTIES.map((specialty) => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registro no Conselho</label>
                <input
                  type="text"
                  value={formData.councilRegistration}
                  onChange={(e) => setFormData({ ...formData, councilRegistration: e.target.value })}
                  placeholder="Ex: CRFa 2-12345"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Biografia</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  placeholder="Breve descrição sobre o profissional..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => { setShowCreateModal(false); resetForm(); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={submitCreate}
                disabled={!formData.userId || !formData.specialty}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedProfessional && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Editar Profissional</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="text"
                  value={selectedProfessional.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidade <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  {SPECIALTIES.map((specialty) => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registro no Conselho</label>
                <input
                  type="text"
                  value={formData.councilRegistration}
                  onChange={(e) => setFormData({ ...formData, councilRegistration: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Biografia</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => { setShowEditModal(false); resetForm(); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={submitUpdate}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedProfessional && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Desativar Profissional</h2>
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja desativar o profissional <strong>{selectedProfessional.email}</strong>?
            </p>
            <p className="text-sm text-gray-500 mb-6">
              O profissional será marcado como inativo e não aparecerá na listagem principal.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={submitDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Desativar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
