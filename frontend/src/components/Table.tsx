"use client"
import { ReactNode } from 'react'
import TableFilter from './TableFilter'
import Pagination from './Pagination'

interface TableColumn {
  key: string
  label: string
  className?: string
}

interface TableProps {
  columns: TableColumn[]
  data?: any[]
  loading?: boolean
  error?: string | null
  emptyMessage?: string
  renderRow: (item: any, index: number) => ReactNode
  // Filter props
  showFilter?: boolean
  filterValue?: string
  onFilterChange?: (value: string) => void
  filterPlaceholder?: string
  // Pagination props
  showPagination?: boolean
  currentPage?: number
  totalPages?: number
  totalItems?: number
  itemsPerPage?: number
  onPageChange?: (page: number) => void
  onItemsPerPageChange?: (itemsPerPage: number) => void
}

export default function Table({
  columns,
  data = [],
  loading = false,
  error = null,
  emptyMessage = 'Nenhum registro encontrado',
  renderRow,
  // Filter props
  showFilter = false,
  filterValue = '',
  onFilterChange = () => {},
  filterPlaceholder,
  // Pagination props
  showPagination = false,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange = () => {},
  onItemsPerPageChange = () => {}
}: TableProps) {
  const colSpan = columns.length

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {showFilter && (
        <TableFilter
          value={filterValue}
          onChange={onFilterChange}
          placeholder={filterPlaceholder}
        />
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={colSpan} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={colSpan} className="px-6 py-12 text-center text-red-600">
                  {error}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="px-6 py-12 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => renderRow(item, index))
            )}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      )}
    </div>
  )
}
