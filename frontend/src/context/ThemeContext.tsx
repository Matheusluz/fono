'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuth } from './AuthContext'

export type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('light')
  const { user, updateThemePreference } = useAuth()

  // Inicializar tema baseado no usuário ou preferência do sistema
  useEffect(() => {
    if (user?.themePreference) {
      // Se o usuário está logado e tem preferência salva, usar ela
      setTheme(user.themePreference)
    } else {
      // Se não há usuário logado, tentar localStorage ou preferência do sistema
      const savedTheme = localStorage.getItem('theme') as Theme
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      
      const initialTheme = savedTheme || systemTheme
      setTheme(initialTheme)
    }
  }, [user])

  // Aplicar tema ao documento
  useEffect(() => {
    const root = document.documentElement
    
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    // Salvar no localStorage como fallback
    localStorage.setItem('theme', theme)
  }, [theme])

  const updateTheme = async (newTheme: Theme) => {
    if (user) {
      // Se há usuário logado, salvar no backend
      try {
        await updateThemePreference(newTheme)
        setTheme(newTheme)
      } catch (error) {
        console.error('Erro ao salvar tema no backend:', error)
        // Em caso de erro, apenas atualizar localmente
        setTheme(newTheme)
      }
    } else {
      // Se não há usuário, apenas atualizar localmente
      setTheme(newTheme)
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    updateTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider')
  }
  return context
}