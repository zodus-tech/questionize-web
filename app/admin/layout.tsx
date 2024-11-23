import { Header } from '@/components/header'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/auth-context'
import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Header title="Questionize" />
      {children}
      <Toaster />
    </AuthProvider>
  )
}
