import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-6xl font-bold text-black mb-4">Em desenvolvimento</h1>
      <p className="text-lg text-gray-500 mb-8">
        Oops! Ainda estamos trabalhando por aqui...
      </p>
      <Link href="/">
        <Button variant="default" className="px-6 py-3 text-sm">
          Voltar para a Página Inicial
        </Button>
      </Link>
    </div>
  )
}
