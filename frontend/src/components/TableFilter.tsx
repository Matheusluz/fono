"use client"

interface TableFilterProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function TableFilter({ value, onChange, placeholder = 'Buscar...' }: TableFilterProps) {
  return (
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <span className="text-gray-500">🔍</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Limpar
          </button>
        )}
      </div>
    </div>
  )
}
