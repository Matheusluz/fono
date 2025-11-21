'use client'

import { useState, useMemo } from 'react'
import { useAuth } from '@/src/context/AuthContext'
import DashboardLayout from '@/src/components/DashboardLayout'
import ProtectedRoute from '@/src/components/ProtectedRoute'
import { useQuery, useMutation } from '@apollo/client'
import { 
  PROFESSIONALS_QUERY, 
  CREATE_PROFESSIONAL_MUTATION, 
  UPDATE_PROFESSIONAL_MUTATION, 
  DELETE_PROFESSIONAL_MUTATION,
  USERS_QUERY,
  SPECIALTIES_QUERY 
} from '@/src/lib/graphql'
import FormInput from '@/src/components/FormInput'
import PageHeader from '@/src/components/PageHeader'
import Table from '@/src/components/Table'
import Modal from '@/src/components/Modal'
import ConfirmDialog from '@/src/components/ConfirmDialog'
import Avatar from '@/src/components/Avatar'
import StatusBadge from '@/src/components/StatusBadge'

interface Professional {
  id: string
  userId: string
  email: string
  fullName: string
  specialtyId: string
  specialtyName: string
  specialty: {
    id: string
    name: string
  }
  councilRegistration: string | null
  bio: string | null
  active: boolean
}

interface User {
  id: string
  email: string
  role: string
}

interface Specialty {
  id: string
  name: string
  active: boolean
}

export default function ProfessionalsPage() {
  const { token } = useAuth()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)
  const [formData, setFormData] = useState({
    userId: '',
    specialtyId: '',
    councilRegistration: '',
    bio: ''
  })
  
  // Filter and pagination state
  const [filterValue, setFilterValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Queries
  const { data, loading, error, refetch } = useQuery(PROFESSIONALS_QUERY, {
    variables: { includeInactive: false },
    skip: !token
  })
  
  const { data: usersData } = useQuery(USERS_QUERY, { skip: !token })
  const { data: specialtiesData } = useQuery(SPECIALTIES_QUERY, { 
    variables: { includeInactive: false },
    skip: !token 
  })

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
    setFormData({ userId: '', specialtyId: '', councilRegistration: '', bio: '' })
    setSelectedProfessional(null)
  }

  // Filter and paginate data
  const { filteredData, paginatedData, totalPages } = useMemo(() => {
    const professionals = data?.professionals || []
    
    // Apply filter
    const filtered = professionals.filter((professional: Professional) => {
      const search = filterValue.toLowerCase()
      return (
        professional.fullName.toLowerCase().includes(search) ||
        professional.email.toLowerCase().includes(search) ||
        professional.specialtyName.toLowerCase().includes(search) ||
        professional.id.toString().includes(search) ||
        professional.councilRegistration?.toLowerCase().includes(search)
      )
    })
    
    // Calculate pagination
    const total = Math.ceil(filtered.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage)
    
    return {
      filteredData: filtered,
      paginatedData: paginated,
      totalPages: total
    }
  }, [data?.professionals, filterValue, currentPage, itemsPerPage])

  // Reset to first page when filter changes
  const handleFilterChange = (value: string) => {
    setFilterValue(value)
    setCurrentPage(1)
  }

  // Reset to first page when items per page changes
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items)
    setCurrentPage(1)
  }

  const handleCreate = () => {
    setShowCreateModal(true)
    resetForm()
  }

  const handleEdit = (professional: Professional) => {
    setSelectedProfessional(professional)
    setFormData({
      userId: professional.userId,
      specialtyId: professional.specialtyId,
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
        specialtyId: formData.specialtyId,
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
        specialtyId: formData.specialtyId,
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
    <ProtectedRoute>
    <DashboardLayout>
      <PageHeader
        title="Profissionais"
        subtitle="Gerencie os profissionais cadastrados"
        actionLabel="Adicionar Profissional"
        actionIcon="+"
        onAction={handleCreate}
      />

      <Table
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'professional', label: 'Profissional' },
          { key: 'specialty', label: 'Especialidade' },
          { key: 'registration', label: 'Registro' },
          { key: 'status', label: 'Status' },
          { key: 'actions', label: 'Ações', className: 'text-right' }
        ]}
        data={paginatedData}
        loading={loading}
        error={error ? `Erro ao carregar profissionais: ${(error as any).message}` : null}
        emptyMessage={filterValue ? 'Nenhum profissional encontrado com esse filtro' : 'Nenhum profissional encontrado'}
        showFilter
        filterValue={filterValue}
        onFilterChange={handleFilterChange}
        filterPlaceholder="Buscar por nome, email, especialidade ou registro..."
        showPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        renderRow={(professional: Professional) => (
          <tr key={professional.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">#{professional.id}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <Avatar initials={professional.email.substring(0,2)} variant="purple" />
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{professional.fullName}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{professional.email}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <StatusBadge label={professional.specialtyName} variant="purple" />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {professional.councilRegistration || '-'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <StatusBadge label={professional.active ? 'Ativo' : 'Inativo'} variant={professional.active ? 'success' : 'neutral'} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                onClick={() => handleEdit(professional)}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4 transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(professional)}
                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
              >
                Desativar
              </button>
            </td>
          </tr>
        )}
      />

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
                  value={formData.specialtyId}
                  onChange={(e) => setFormData({ ...formData, specialtyId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecione uma especialidade</option>
                  {(specialtiesData?.specialties || []).map((specialty: Specialty) => (
                    <option key={specialty.id} value={specialty.id}>{specialty.name}</option>
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
                disabled={!formData.userId || !formData.specialtyId}
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
                  value={formData.specialtyId}
                  onChange={(e) => setFormData({ ...formData, specialtyId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  {(specialtiesData?.specialties || []).map((specialty: Specialty) => (
                    <option key={specialty.id} value={specialty.id}>{specialty.name}</option>
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
    </DashboardLayout>
    </ProtectedRoute>
  )
}
