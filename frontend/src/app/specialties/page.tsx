'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@apollo/client'
import { 
  SPECIALTIES_QUERY, 
  CREATE_SPECIALTY_MUTATION, 
  UPDATE_SPECIALTY_MUTATION, 
  DELETE_SPECIALTY_MUTATION 
} from '@/src/lib/graphql'
import { useAuth } from '@/src/context/AuthContext'
import DashboardLayout from '@/src/components/DashboardLayout'
import ProtectedRoute from '@/src/components/ProtectedRoute'
import Modal from '@/src/components/Modal'
import Table from '@/src/components/Table'
import PageHeader from '@/src/components/PageHeader'
import StatusBadge from '@/src/components/StatusBadge'
import ConfirmDialog from '@/src/components/ConfirmDialog'

interface Specialty {
  id: string
  name: string
  description?: string
  active: boolean
  professionalsCount: number
  createdAt: string
  updatedAt: string
}

export default function SpecialtiesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [filterValue, setFilterValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const { data, loading, error, refetch } = useQuery(SPECIALTIES_QUERY, {
    variables: { includeInactive: true }
  })

  const [createSpecialty] = useMutation(CREATE_SPECIALTY_MUTATION)
  const [updateSpecialty] = useMutation(UPDATE_SPECIALTY_MUTATION)
  const [deleteSpecialty] = useMutation(DELETE_SPECIALTY_MUTATION)

  const specialties: Specialty[] = data?.specialties || []

  // Filtragem
  const filteredData = useMemo(() => {
    if (!filterValue.trim()) return specialties

    const search = filterValue.toLowerCase()
    return specialties.filter((specialty) => 
      specialty.name.toLowerCase().includes(search) ||
      specialty.description?.toLowerCase().includes(search) ||
      specialty.id.includes(search)
    )
  }, [specialties, filterValue])

  // Paginação
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredData.slice(startIndex, endIndex)
  }, [filteredData, currentPage, itemsPerPage])

  const handleOpenModal = (specialty?: Specialty) => {
    if (specialty) {
      setSelectedSpecialty(specialty)
      setFormData({ 
        name: specialty.name, 
        description: specialty.description || '' 
      })
    } else {
      setSelectedSpecialty(null)
      setFormData({ name: '', description: '' })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedSpecialty(null)
    setFormData({ name: '', description: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (selectedSpecialty) {
        const { data } = await updateSpecialty({
          variables: {
            id: selectedSpecialty.id,
            ...formData
          }
        })

        if (data.updateSpecialty.errors.length > 0) {
          alert(data.updateSpecialty.errors.join('\n'))
          return
        }
      } else {
        const { data } = await createSpecialty({
          variables: formData
        })

        if (data.createSpecialty.errors.length > 0) {
          alert(data.createSpecialty.errors.join('\n'))
          return
        }
      }

      await refetch()
      handleCloseModal()
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar especialidade')
    }
  }

  const handleToggleActive = async (specialty: Specialty) => {
    try {
      const { data } = await updateSpecialty({
        variables: {
          id: specialty.id,
          active: !specialty.active
        }
      })

      if (data.updateSpecialty.errors.length > 0) {
        alert(data.updateSpecialty.errors.join('\n'))
        return
      }

      await refetch()
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar status')
    }
  }

  const handleDeleteClick = (specialty: Specialty) => {
    setSelectedSpecialty(specialty)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedSpecialty) return

    try {
      const { data } = await deleteSpecialty({
        variables: { id: selectedSpecialty.id }
      })

      if (data.deleteSpecialty.errors.length > 0) {
        alert(data.deleteSpecialty.errors.join('\n'))
        return
      }

      await refetch()
      setIsDeleteModalOpen(false)
      setSelectedSpecialty(null)
    } catch (err: any) {
      alert(err.message || 'Erro ao desativar especialidade')
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <PageHeader
            title="Especialidades"
            subtitle="Gerencie as especialidades dos profissionais"
            actionLabel="Nova Especialidade"
            onAction={() => handleOpenModal()}
          />

          <Table
            columns={[
              { key: 'name', label: 'Nome' },
              { key: 'description', label: 'Descrição' },
              { key: 'professionals', label: 'Profissionais' },
              { key: 'status', label: 'Status' },
              { key: 'actions', label: 'Ações' }
            ]}
            data={paginatedData}
            loading={loading}
            error={error?.message}
            emptyMessage="Nenhuma especialidade cadastrada"
            showFilter={true}
            filterValue={filterValue}
            onFilterChange={setFilterValue}
            filterPlaceholder="Buscar por nome, descrição ou ID..."
            showPagination={true}
            currentPage={currentPage}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(value: number) => {
              setItemsPerPage(value)
              setCurrentPage(1)
            }}
            renderRow={(specialty: Specialty) => (
              <tr key={specialty.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {specialty.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {specialty.description || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {specialty.professionalsCount}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge 
                    label={specialty.active ? 'Ativo' : 'Inativo'}
                    variant={specialty.active ? 'success' : 'neutral'}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleOpenModal(specialty)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleToggleActive(specialty)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    {specialty.active ? 'Desativar' : 'Ativar'}
                  </button>
                  <button
                    onClick={() => handleDeleteClick(specialty)}
                    className="text-red-600 hover:text-red-900"
                    disabled={specialty.professionalsCount > 0}
                    title={specialty.professionalsCount > 0 ? 'Não é possível excluir especialidade com profissionais vinculados' : 'Desativar especialidade'}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            )}
          />

          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title={selectedSpecialty ? 'Editar Especialidade' : 'Nova Especialidade'}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  placeholder="Ex: Fonoaudiologia Clínica"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  placeholder="Breve descrição da especialidade..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                >
                  {selectedSpecialty ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </Modal>

          <ConfirmDialog
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false)
              setSelectedSpecialty(null)
            }}
            onConfirm={handleDeleteConfirm}
            title="Desativar Especialidade"
            message={`Tem certeza que deseja desativar a especialidade "${selectedSpecialty?.name}"?`}
            confirmLabel="Desativar"
            cancelLabel="Cancelar"
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
