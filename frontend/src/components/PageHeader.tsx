"use client"

interface PageHeaderProps {
  title: string
  subtitle?: string
  actionLabel?: string
  onAction?: () => void
  actionIcon?: string
}

export default function PageHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
  actionIcon = '➕'
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span className="text-xl">{actionIcon}</span>
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  )
}
