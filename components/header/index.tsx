'use client'

import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const getInitials = (fullName: string) => {
    const nameParts = fullName.split(' ')
    const firstInitial = nameParts[0]?.[0] || ''
    const lastInitial =
      nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : ''
    return (firstInitial + lastInitial).toUpperCase()
  }

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 px-4 md:px-6 h-14 flex items-center justify-between">
      <Link href="#" className="flex items-center gap-2" prefetch={false}>
        <span className="text-lg font-bold">{title}</span>
      </Link>
      {user && (
        <>
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/filmes"
              className="text-sm font-medium hover:underline underline-offset-4"
              prefetch={false}
            >
              Filmes
            </Link>
            <Link
              href="/favoritos"
              className="text-sm font-medium hover:underline underline-offset-4"
              prefetch={false}
            >
              Favoritos
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 border-black/20 border">
                  <AvatarImage src="" alt="@shadcn" />
                  <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => router.push('/configuracoes')}>
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      )}
    </header>
  )
}
