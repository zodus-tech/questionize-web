'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Menu } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog'

import { useAuth } from '@/contexts/auth-context'
import AvatarHolder from '../credits/avatar-holder'
import AvatarCard from '../credits/avatar-card'

interface HeaderProps {
  title: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Header({ title }: HeaderProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const getInitials = (fullName: string) => {
    const nameParts = fullName.split(' ')
    const firstInitial = nameParts[0]?.[0] || ''
    const lastInitial =
      nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : ''
    return (firstInitial + lastInitial).toUpperCase()
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/questionnaires', label: 'Questionários' },
    { href: '/admin/departments', label: 'Setores' },
  ]

  return (
    <header className="bg-slate-50 sticky top-0 z-50 px-4 md:px-6 h-14 flex items-center justify-between border-b">
      <div className="flex items-center gap-2">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <Image src="/logo.png" alt="Logo" width={150} height={50} />
        </Link>
      </div>
      {user && (
        <>
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium hover:bg-black/5 data-[active=true]:bg-black/5 p-2 px-4 rounded-md"
                prefetch={false}
                data-active={pathname.includes(
                  item.href.split('/').pop() || '',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-white">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-sm font-medium hover:bg-black/5 data-[active=true]:bg-black/5 p-2 px-4 rounded-md"
                      prefetch={false}
                      data-active={pathname.includes(
                        item.href.split('/').pop() || '',
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <Dialog open={open} onOpenChange={setOpen}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-9 w-9 border-black/20 border cursor-pointer">
                    <AvatarImage src="" alt={user?.name} />
                    <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => router.push('/admin/configuracoes')}
                  >
                    Configurações
                  </DropdownMenuItem>
                  <DialogTrigger asChild>
                    <DropdownMenuItem>Créditos</DropdownMenuItem>
                  </DialogTrigger>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Sair</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle className="font-bold">
                    Projeto de Extensão
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <AvatarHolder label="Coordenador">
                      <AvatarCard
                        name="Prof. Dr. Elvio Gilberto da Silva"
                        fallback="EG"
                        src="https://media.licdn.com/dms/image/C4D03AQHqjWJ2YfG_iw/profile-displayphoto-shrink_200_200/0/1566067483391?e=2147483647&v=beta&t=1FyXLaOWepRoSY4ADZZjOwVaGgDa_n4bXNLQ4k_cIC8"
                      />
                    </AvatarHolder>
                    <AvatarHolder label="Professor Colaborador">
                      <AvatarCard
                        name="Prof. Dr. Elvio Gilberto da Silva"
                        fallback="EG"
                        src="https://media.licdn.com/dms/image/C4D03AQHqjWJ2YfG_iw/profile-displayphoto-shrink_200_200/0/1566067483391?e=2147483647&v=beta&t=1FyXLaOWepRoSY4ADZZjOwVaGgDa_n4bXNLQ4k_cIC8"
                      />
                    </AvatarHolder>
                  </div>
                  <AvatarHolder label="Equipe">
                    <div className="flex flex-wrap gap-2">
                      <AvatarCard
                        name="Arthur Marques de Oliveira"
                        fallback="AM"
                        src="https://github.com/arthurm9.png"
                      />
                      <AvatarCard
                        name="João Erik da Silva Crisostomo"
                        fallback="JE"
                        src="https://github.com/joao-erik2077.png"
                      />
                      <AvatarCard
                        name="Lucas Vieira da Silva"
                        fallback="LV"
                        src="https://github.com/lucasvieiras.png"
                      />
                    </div>
                  </AvatarHolder>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs mb-2">Desenvolvimento:</p>
                      <div className="w-full h-12 bg-coordenadoriaExtensao bg-contain bg-center bg-no-repeat bg-white rounded-md"></div>
                    </div>
                    <div>
                      <p className="text-xs mb-2">Apoio:</p>
                      <p className="text-xs text-zinc-700 dark:text-zinc-300 mb-2">
                        José Augusto Magalhães – Coordenador de Extensão
                      </p>
                      <div className="w-1/2 h-12 bg-unisagrado bg-contain bg-center bg-no-repeat bg-white rounded-md"></div>
                    </div>
                  </div>
                </div>
                <DialogFooter className="sm:justify-start"></DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </>
      )}
    </header>
  )
}
