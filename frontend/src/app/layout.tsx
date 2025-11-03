import './globals.css'
import Providers from './Providers'

export const metadata = {
  title: 'Fono - Frontend',
  description: 'Frontend para o sistema de fonoaudiologia',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
