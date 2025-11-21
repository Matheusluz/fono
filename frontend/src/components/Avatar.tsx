"use client"

type AvatarVariant = 'blue' | 'green' | 'purple' | 'red' | 'yellow'

interface AvatarProps {
  initials: string
  variant?: AvatarVariant
  size?: 'sm' | 'md' | 'lg'
}

const variantStyles: Record<AvatarVariant, string> = {
  blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
  green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300',
  purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300',
  red: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300',
  yellow: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300'
}

const sizeStyles = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base'
}

export default function Avatar({ initials, variant = 'blue', size = 'md' }: AvatarProps) {
  return (
    <div className={`flex-shrink-0 ${sizeStyles[size]} ${variantStyles[variant]} rounded-full flex items-center justify-center`}>
      <span className="font-medium uppercase">
        {initials.substring(0, 2)}
      </span>
    </div>
  )
}
