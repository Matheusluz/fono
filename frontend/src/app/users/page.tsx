"use client"
import { useState, useMemo } from 'react'
import { useAuth } from '@/src/context/AuthContext'
import DashboardLayout from '@/src/components/DashboardLayout'
import ProtectedRoute from '@/src/components/ProtectedRoute'
import { useQuery, useMutation } from '@apollo/client'
import { USERS_QUERY, REGISTER_USER_MUTATION, UPDATE_USER_MUTATION, DELETE_USER_MUTATION } from '@/src/lib/graphql'
import FormInput from '@/src/components/FormInput'
import PageHeader from '@/src/components/PageHeader'
import Table from '@/src/components/Table'
import Modal from '@/src/components/Modal'
import ConfirmDialog from '@/src/components/ConfirmDialog'
import Avatar from '@/src/components/Avatar'
import StatusBadge from '@/src/components/StatusBadge'

interface User {
  id: string
  email: string
  admin: boolean
}

export default function UsersPage() {
  const { user: currentUser, token } = useAuth()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirmation: '',
    admin: false
  })
  const [formError, setFormError] = useState<string | null>(null)
  
  // Filter and pagination state
  const [filterValue, setFilterValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const { data, loading, error, refetch } = useQuery(USERS_QUERY, {
    skip: !token
  })

  // Filter and paginate data
  const { filteredData, paginatedData, totalPages } = useMemo(() => {
    const users = data?.users || []
    
    // Apply filter
    const filtered = users.filter((user: User) =>
      user.email.toLowerCase().includes(filterValue.toLowerCase()) ||
      user.id.toString().includes(filterValue)
    )
    
    // Calculate pagination
    const total = Math.ceil(filtered.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage)
    
    return {
      filteredData: filtered,
      paginatedData: paginated,
      totalPages: total
    }
  }, [data?.users, filterValue, currentPage, itemsPerPage])

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

  const [registerUser, { loading: creating }] = useMutation(REGISTER_USER_MUTATION, {
    onCompleted: (data) => {
      if (data.registerUser.errors.length === 0) {
        setShowCreateModal(false)
        resetForm()
        refetch()
      } else {
        setFormError(data.registerUser.errors.join(', '))
      }
    },
    onError: (err) => {
      setFormError(err.message)
    }
  })

  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: (data) => {
      if (data.updateUser.errors.length === 0) {
        setShowEditModal(false)
        setSelectedUser(null)
        resetForm()
        refetch()
      } else {
        setFormError(data.updateUser.errors.join(', '))
      }
    },
    onError: (err) => {
      setFormError(err.message)
    }
  })

  const [deleteUser, { loading: deleting }] = useMutation(DELETE_USER_MUTATION, {
    onCompleted: (data) => {
      if (data.deleteUser.success) {
        setShowDeleteModal(false)
        setSelectedUser(null)
        refetch()
      } else {
        setFormError(data.deleteUser.errors.join(', '))
      }
    },
    onError: (err) => {
      setFormError(err.message)
    }
  })
  const resetForm = () => {
    setFormData({ email: '', password: '', passwordConfirmation: '', admin: false })
    setFormError(null)
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    
    if (formData.password !== formData.passwordConfirmation) {
      setFormError('As senhas não conferem')
      return
    }

    await registerUser({
      variables: {
        email: formData.email,
        password: formData.password,
        passwordConfirmation: formData.passwordConfirmation
      }
    })
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (formData.password && formData.password !== formData.passwordConfirmation) {
      setFormError('As senhas não conferem')
      return
    }

    if (!selectedUser) return

    const variables: any = {
      id: selectedUser.id,
      email: formData.email,
      admin: formData.admin
    }

    // Só inclui senha se foi preenchida
    if (formData.password) {
      variables.password = formData.password
      variables.passwordConfirmation = formData.passwordConfirmation
    }

    await updateUser({ variables })
  }

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return

    await deleteUser({
      variables: {
        id: selectedUser.id
      }
    })
  }

  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setFormData({
      email: user.email,
      password: '',
      passwordConfirmation: '',
      admin: user.admin
    })
    setFormError(null)
    setShowEditModal(true)
  }

  const openDeleteModal = (user: User) => {
    setSelectedUser(user)
    setFormError(null)
    setShowDeleteModal(true)
  }

  const tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'email', label: 'Email' },
    { key: 'type', label: 'Tipo' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Ações', className: 'text-right' }
  ]

  return (
    <ProtectedRoute requiredRole="admin">
    <DashboardLayout>
      <PageHeader
        title="Gestão de Usuários"
        subtitle="Gerencie usuários e permissões do sistema"
        actionLabel="Novo Usuário"
        onAction={() => {
          resetForm()
          setShowCreateModal(true)
        }}
      />

      <Table
        columns={tableColumns}
        data={paginatedData}
        loading={loading}
        error={error ? `Erro ao carregar usuários: ${error.message}` : null}
        emptyMessage={filterValue ? 'Nenhum usuário encontrado com esse filtro' : 'Nenhum usuário encontrado'}
        showFilter={true}
        filterValue={filterValue}
        onFilterChange={handleFilterChange}
        filterPlaceholder="Buscar por email ou ID..."
        showPagination={true}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        renderRow={(user: User) => (
          <tr key={user.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              #{user.id}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <Avatar initials={user.email.charAt(0)} variant="blue" />
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">{user.email}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <StatusBadge
                label={user.admin ? 'Administrador' : 'Usuário'}
                variant={user.admin ? 'info' : 'neutral'}
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <StatusBadge label="Ativo" variant="success" />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                onClick={() => openEditModal(user)}
                className="text-blue-600 hover:text-blue-900 mr-4"
                title="Editar"
              >
                ✏️
              </button>
              <button
                onClick={() => openDeleteModal(user)}
                className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Deletar"
                disabled={user.id === currentUser?.id}
              >
                🗑️
              </button>
            </td>
          </tr>
        )}
      />

      {/* Modal for Creating User */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          resetForm()
        }}
        title="Novo Usuário"
      >
        <form onSubmit={handleCreateSubmit}>
              <FormInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="usuario@exemplo.com"
              />
              
              <FormInput
                label="Senha"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="Mínimo 6 caracteres"
              />
              
              <FormInput
                label="Confirmar Senha"
                type="password"
                value={formData.passwordConfirmation}
                onChange={(e) => setFormData({ ...formData, passwordConfirmation: e.target.value })}
                required
                placeholder="Digite a senha novamente"
              />

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{formError}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false)
                  resetForm()
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={creating}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {creating ? 'Criando...' : 'Criar Usuário'}
              </button>
            </div>
          </form>
        </Modal>

      {/* Modal for Editing User */}
      <Modal
        isOpen={showEditModal && !!selectedUser}
        onClose={() => {
          setShowEditModal(false)
          setSelectedUser(null)
          resetForm()
        }}
        title="Editar Usuário"
      >
        <form onSubmit={handleEditSubmit}>
              <FormInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="usuario@exemplo.com"
              />
              
              <FormInput
                label="Nova Senha (deixe em branco para manter)"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Mínimo 6 caracteres"
              />
              
              {formData.password && (
                <FormInput
                  label="Confirmar Nova Senha"
                  type="password"
                  value={formData.passwordConfirmation}
                  onChange={(e) => setFormData({ ...formData, passwordConfirmation: e.target.value })}
                  placeholder="Digite a senha novamente"
                />
              )}

              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.admin}
                    onChange={(e) => setFormData({ ...formData, admin: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Administrador</span>
                </label>
              </div>

              {formError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{formError}</p>
              </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setShowEditModal(false)
                setSelectedUser(null)
                resetForm()
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={updating}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {updating ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal for Deleting User */}
      <ConfirmDialog
        isOpen={showDeleteModal && !!selectedUser}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedUser(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Confirmar Exclusão"
        confirmLabel="Sim, Deletar"
        isLoading={deleting}
        message={
          selectedUser ? (
            <div>
              <p className="text-gray-700 mb-4">
                Tem certeza que deseja deletar o usuário:
              </p>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900">{selectedUser.email}</p>
                {selectedUser.admin && (
                  <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    Administrador
                  </span>
                )}
              </div>
              <p className="text-red-600 text-sm mt-4">
                ⚠️ Esta ação não pode ser desfeita.
              </p>
              {formError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{formError}</p>
                </div>
              )}
            </div>
          ) : ''
        }
      />

      {/* Stats Footer */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-blue-800">
            <span className="text-xl">ℹ️</span>
            <span>Total de usuários: <strong>{data?.users?.length || 0}</strong></span>
          </div>
          <div className="text-blue-600">
            Administradores: <strong>{data?.users?.filter((u: User) => u.admin).length || 0}</strong>
          </div>
        </div>
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  )
}
