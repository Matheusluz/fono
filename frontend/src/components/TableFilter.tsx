"use client"

interface TableFilterProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function TableFilter({ value, onChange, placeholder = 'Buscar...' }: TableFilterProps) {
  return (
    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
      <div className="flex items-center gap-2">
        <span className="text-gray-500 dark:text-gray-400">🔍</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            Limpar
          </button>
        )}
      </div>
    </div>
  )
}
