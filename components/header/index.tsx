/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { usePathname, useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@radix-ui/react-dialog'
import { DialogFooter, DialogHeader } from '../ui/dialog'
import AvatarHolder from '../credits/avatar-holder'
import AvatarCard from '../credits/avatar-card'
import { useState } from 'react'
import Image from 'next/image'

interface HeaderProps {
  title: string
}

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

  return (
    <header className="bg-slate-50 sticky top-0 z-50 px-4 md:px-6 h-14 flex items-center justify-between border-b ">
      <Link href="#" className="flex items-center gap-2" prefetch={false}>
        <Image src="/logo.png" alt="Logo" width={150} height={50} />
      </Link>
      {user && (
        <>
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/admin/dashboard"
              className="text-sm font-medium hover:bg-black/5 data-[active=true]:bg-black/5 p-2 px-4 rounded-md"
              prefetch={false}
              data-active={pathname.includes('dashboard')}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/questionnaires"
              className="text-sm font-medium hover:bg-black/5 data-[active=true]:bg-black/5 p-2 px-4 rounded-md"
              prefetch={false}
              data-active={pathname.includes('questionnaires')}
            >
              Questionários
            </Link>
            <Link
              href="/admin/departments"
              className="text-sm font-medium hover:bg-black/5 data-[active=true]:bg-black/5 p-2 px-4 rounded-md"
              prefetch={false}
              data-active={pathname.includes('departments')}
            >
              Departamentos
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Dialog open={open} onOpenChange={setOpen}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-9 w-9 border-black/20 border">
                    <AvatarImage src="" alt="@shadcn" />
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

              <DialogContent>
                <div className="absolute top-0 left-0 w-screen h-screen flex items-center justify-center">
                  <div
                    className="absolute top-0 left-0 w-screen h-screen bg-[#00000050] z-0"
                    onClick={() => setOpen(false)}
                  ></div>
                  <div className="border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg bg-white z-40">
                    <DialogHeader className="flex flex-row">
                      <DialogTitle className="font-bold w-full">
                        Projeto de Extensão
                      </DialogTitle>
                      <DialogTitle
                        className=" text-end cursor-pointer m-0 p-0 !mt-0 text-black/50"
                        onClick={() => setOpen(false)}
                      >
                        X
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center space-x-2 pt-4">
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
                    <div className="flex items-center space-x-2 pt-4">
                      <AvatarHolder label="Equipe">
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
                      </AvatarHolder>
                    </div>
                    <div className="flex items-center space-x-2 pt-4">
                      <div className="grid grid-cols-2 items-center min-h-12 w-full">
                        <p className="w-full h-fit text-xs">Desenvolvimento:</p>
                        <div className="w-full h-full bg-coordenadoriaExtensao bg-fit bg-center bg-no-repeat bg-white rounded-md"></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 pt-4">
                      <div className="grid grid-cols-2 items-center min-h-12 w-full">
                        <div className="w-full h-fit flex flex-start flex-col items-center">
                          <p className="w-full text-xs">Apoio:</p>
                          <p className="w-full text-xs text-zinc-700 dark:text-zinc-300">
                            José Augusto Magalhães – Coordenador de Extensão
                          </p>
                        </div>
                        <div className="w-1/2 h-full bg-unisagrado bg-fit bg-center bg-no-repeat bg-white rounded-md"></div>
                      </div>
                    </div>
                    <DialogFooter className="sm:justify-start"></DialogFooter>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </>
      )}
    </header>
  )
}
