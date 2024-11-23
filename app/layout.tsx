import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const rubik = localFont({
  src: './fonts/Rubik-Black.woff',
  variable: '--font-montserrat',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: {
    template: 'Questionize - %s',
    default: 'Questionize - Criação e Gestão de Questionários',
  },
  description:
    'Questionize é uma plataforma poderosa que permite aos usuários criar, gerenciar e analisar questionários personalizados com facilidade. Desenhe suas pesquisas, colete respostas e obtenha insights valiosos sobre seu público.',
  keywords: [
    'Questionário',
    'Pesquisa',
    'Formulários',
    'Coleta de Dados',
    'Respostas',
    'Análise',
    'Questionize',
  ],
  authors: [{ name: 'Zodus', url: 'zodus.com.br' }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${rubik.variable} antialiased light bg-slate-50`}>
        {children}
      </body>
    </html>
  )
}
