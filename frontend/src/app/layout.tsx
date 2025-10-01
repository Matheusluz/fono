// src/app/layout.tsx
import "../../styles/globals.css"; // caminho relativo correto para a pasta styles

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
