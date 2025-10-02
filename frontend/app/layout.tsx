import './globals.css'

export const metadata = {
  title: 'Fono - Frontend',
  description: 'Frontend para o sistema de fonoaudiologia',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
