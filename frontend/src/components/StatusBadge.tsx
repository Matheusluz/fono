"use client"

type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'purple'

interface StatusBadgeProps {
  label: string
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
  danger: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
  warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
  info: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
  neutral: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
  purple: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
}

export default function StatusBadge({ label, variant = 'neutral' }: StatusBadgeProps) {
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${variantStyles[variant]}`}>
      {label}
    </span>
  )
}
