"use client"
import { useEffect, useState } from 'react'
import { useAuth } from '@/src/context/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/src/components/DashboardLayout'
import { useQuery, useMutation } from '@apollo/client'
import { PATIENTS_QUERY, CREATE_PATIENT_MUTATION, UPDATE_PATIENT_MUTATION, DELETE_PATIENT_MUTATION } from '@/src/lib/graphql'
import FormInput from '@/src/components/FormInput'

interface Patient {
  id: string
  firstName: string
  lastName: string
  birthdate?: string
  email?: string
  phone?: string
}

export default function PatientsPage() {
  const { user: currentUser, loading: authLoading, token } = useAuth()
  const router = useRouter()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthdate: '',
    email: '',
    phone: ''
  })
  const [formError, setFormError] = useState<string | null>(null)

  const { data, loading, error, refetch } = useQuery(PATIENTS_QUERY, {
    skip: !token
  })

  const [createPatient, { loading: creating }] = useMutation(CREATE_PATIENT_MUTATION, {
    onCompleted: (data) => {
      if (data.createPatient.errors.length === 0) {
        setShowCreateModal(false)
        resetForm()
        refetch()
      } else {
        setFormError(data.createPatient.errors.join(', '))
      }
    },
    onError: (err) => {
      setFormError(err.message)
    }
  })

  const [updatePatient, { loading: updating }] = useMutation(UPDATE_PATIENT_MUTATION, {
    onCompleted: (data) => {
      if (data.updatePatient.errors.length === 0) {
        setShowEditModal(false)
        setSelectedPatient(null)
        resetForm()
        refetch()
      } else {
        setFormError(data.updatePatient.errors.join(', '))
      }
    },
    onError: (err) => {
      setFormError(err.message)
    }
  })

  const [deletePatient, { loading: deleting }] = useMutation(DELETE_PATIENT_MUTATION, {
    onCompleted: (data) => {
      if (data.deletePatient.success) {
        setShowDeleteModal(false)
        setSelectedPatient(null)
        refetch()
      } else {
        setFormError(data.deletePatient.errors.join(', '))
      }
    },
    onError: (err) => {
      setFormError(err.message)
    }
  })

  useEffect(() => {
    if (!authLoading && !token) {
      router.replace('/')
    }
  }, [authLoading, token, router])

  const resetForm = () => {
    setFormData({ firstName: '', lastName: '', birthdate: '', email: '', phone: '' })
    setFormError(null)
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    await createPatient({
      variables: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthdate: formData.birthdate || null,
        email: formData.email || null,
        phone: formData.phone || null
      }
    })
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!selectedPatient) return

    await updatePatient({
      variables: {
        id: selectedPatient.id,
        firstName: formData.firstName || null,
        lastName: formData.lastName || null,
        birthdate: formData.birthdate || null,
        email: formData.email || null,
        phone: formData.phone || null
      }
    })
  }

  const handleDeleteConfirm = async () => {
    if (!selectedPatient) return

    await deletePatient({
      variables: {
        id: selectedPatient.id
      }
    })
  }

  const openEditModal = (patient: Patient) => {
    setSelectedPatient(patient)
    setFormData({
      firstName: patient.firstName,
      lastName: patient.lastName,
      birthdate: patient.birthdate || '',
      email: patient.email || '',
      phone: patient.phone || ''
    })
    setFormError(null)
    setShowEditModal(true)
  }

  const openDeleteModal = (patient: Patient) => {
    setSelectedPatient(patient)
    setFormError(null)
    setShowDeleteModal(true)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const calculateAge = (birthdate?: string) => {
    if (!birthdate) return '-'
    const today = new Date()
    const birth = new Date(birthdate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return `${age} anos`
  }

  if (authLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Pacientes</h1>
          <p className="text-gray-600">Gerencie os pacientes cadastrados no sistema</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowCreateModal(true)
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span className="text-xl">➕</span>
          <span>Novo Paciente</span>
        </button>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome Completo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Nascimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Idade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefone
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-red-600">
                    Erro ao carregar pacientes: {error.message}
                  </td>
                </tr>
              ) : data?.patients?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Nenhum paciente encontrado
                  </td>
                </tr>
              ) : (
                data?.patients?.map((patient: Patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{patient.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-medium">
                            {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {patient.firstName} {patient.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(patient.birthdate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {calculateAge(patient.birthdate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(patient)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => openDeleteModal(patient)}
                        className="text-red-600 hover:text-red-900"
                        title="Deletar"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Creating Patient */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Novo Paciente</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <FormInput
                label="Nome"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                placeholder="João"
              />
              
              <FormInput
                label="Sobrenome"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                placeholder="Silva"
              />
              
              <FormInput
                label="Data de Nascimento"
                type="date"
                value={formData.birthdate}
                onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
              />
              
              <FormInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="paciente@exemplo.com"
              />
              
              <FormInput
                label="Telefone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(11) 99999-9999"
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
                  {creating ? 'Criando...' : 'Criar Paciente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Editing Patient */}
      {showEditModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Editar Paciente</h2>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedPatient(null)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <FormInput
                label="Nome"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                placeholder="João"
              />
              
              <FormInput
                label="Sobrenome"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                placeholder="Silva"
              />
              
              <FormInput
                label="Data de Nascimento"
                type="date"
                value={formData.birthdate}
                onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
              />
              
              <FormInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="paciente@exemplo.com"
              />
              
              <FormInput
                label="Telefone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(11) 99999-9999"
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
                    setShowEditModal(false)
                    setSelectedPatient(null)
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
          </div>
        </div>
      )}

      {/* Modal for Deleting Patient */}
      {showDeleteModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Confirmar Exclusão</h2>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setSelectedPatient(null)
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Tem certeza que deseja deletar o paciente:
              </p>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900">
                  {selectedPatient.firstName} {selectedPatient.lastName}
                </p>
                {selectedPatient.email && (
                  <p className="text-sm text-gray-600 mt-1">{selectedPatient.email}</p>
                )}
              </div>
              <p className="text-red-600 text-sm mt-4">
                ⚠️ Esta ação pode ser desfeita posteriormente (soft delete).
              </p>
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
                  setShowDeleteModal(false)
                  setSelectedPatient(null)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Deletando...' : 'Sim, Deletar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Footer */}
      <div className="mt-6 bg-green-50 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-green-800">
            <span className="text-xl">ℹ️</span>
            <span>Total de pacientes: <strong>{data?.patients?.length || 0}</strong></span>
          </div>
          <div className="text-green-600">
            Ativos: <strong>{data?.patients?.length || 0}</strong>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
