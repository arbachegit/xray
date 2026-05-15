import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Icons.ai · Xray — IA descritiva sobre dados públicos',
  description: 'A IA descritiva determinística sobre dados públicos brasileiros — IBGE, ANEEL, IRPF, CNAE e mais.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,700;1,9..144,500&family=JetBrains+Mono:wght@400;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
