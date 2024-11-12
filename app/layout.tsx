import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/auth-context'
import { Header } from '@/components/header'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased light bg-slate-50`}
      >
        <AuthProvider>
          <Header title="Questionize" />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
