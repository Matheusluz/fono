"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/src/context/AuthContext'
import { useTheme } from '@/src/context/ThemeContext'

interface NavItem {
  label: string
  href?: string
  icon: string
  subItems?: NavItem[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/home', icon: '📊' },
  { label: 'Usuários', href: '/users', icon: '👤' },
  { label: 'Pacientes', href: '/patients', icon: '👥' },
  { label: 'Profissionais', href: '/professionals', icon: '👨‍⚕️' },
  { 
    label: 'Cadastros Gerais', 
    icon: '📋',
    subItems: [
      { label: 'Especialidades', href: '/specialties', icon: '🎓' }
    ]
  },
  { label: 'Relatórios', href: '/reports', icon: '📈' },
  { label: 'Configurações', href: '/settings', icon: '⚙️' },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [expandedItems, setExpandedItems] = useState<string[]>(['Cadastros Gerais'])
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const toggleSubMenu = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    )
  }

  const isSubItemActive = (item: NavItem) => {
    if (item.subItems) {
      return item.subItems.some(sub => sub.href === pathname)
    }
    return false
  }

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-gray-900 dark:bg-gray-950 text-white transition-transform duration-300 z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 w-64
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-blue-400">Fono</h1>
          {user && (
            <div className="mt-3">
              <p className="text-sm text-gray-400">Olá,</p>
              <p className="text-sm font-medium truncate">{user.email}</p>
              {user.admin && (
                <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-600 rounded">
                  Admin
                </span>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const hasSubItems = item.subItems && item.subItems.length > 0
            const isExpanded = expandedItems.includes(item.label)
            const subItemActive = isSubItemActive(item)

            return (
              <div key={item.label}>
                {hasSubItems ? (
                  <>
                    <button
                      onClick={() => toggleSubMenu(item.label)}
                      className={`
                        w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors
                        ${subItemActive
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <span className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                        ▶
                      </span>
                    </button>
                    {isExpanded && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.subItems?.map((subItem) => {
                          const isSubActive = pathname === subItem.href
                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href || '#'}
                              className={`
                                flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm
                                ${isSubActive 
                                  ? 'bg-blue-500 text-white' 
                                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }
                              `}
                            >
                              <span>{subItem.icon}</span>
                              <span>{subItem.label}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href || '#'}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }
                    `}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer / Theme Toggle & Logout */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
          >
            <span className="text-xl">{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span className="font-medium">{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}
    </>
  )
}
