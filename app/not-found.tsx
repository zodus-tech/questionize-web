import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      {/* <div className="mb-6">
          <Image
            src="/unisagrado_coord.png"
            alt="Logo da Empresa"
            width={200}
            height={200}
            priority
          />
        </div> */}
      <h1 className="text-6xl font-bold text-black mb-4">404</h1>
      <p className="text-lg text-gray-500 mb-8">
        Oops! A página que você procura não existe.
      </p>
      <Link href="/">
        <Button variant="default" className="px-6 py-3 text-sm">
          Voltar para a Página Inicial
        </Button>
      </Link>
    </div>
  )
}
