import { Toaster } from '@/components/ui/toaster'
import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
