'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import LoadingSpinner from '@/components/loadingSpinner'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { Member } from '@/interfaces/member'
import { useDepartmentMembers } from '@/hooks/use-department-members'

export default function DepartmentDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const { department, loading, addMember, deleteMember } = useDepartmentMembers(
    params.id,
  )
  const [searchTerm, setSearchTerm] = useState('')
  const { register, handleSubmit, reset } = useForm<{
    name: string
    role?: string
    imageFile?: File
  }>()

  const handleAddMember = async (data: {
    name: string
    role?: string
    imageFile?: File
  }) => {
    const success = await addMember(data)
    if (success) {
      reset()
    }
  }

  const filteredMembers = department?.members?.filter((member: Member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-col mx-16 bg-slate-50">
      <LoadingSpinner isLoading={loading} />
      <main className="container sticky top-[56px] z-10 mt-4 px-4 py-4 bg-tile-pattern bg-center bg-repeat rounded-lg w-full max-w-screen-xl">
        <div className="flex justify-between items-center p-2">
          <h2 className="text-2xl font-bold text-white">
            {loading
              ? 'Carregando...'
              : department
                ? department.name
                : 'Departamento não encontrado'}
          </h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Adicionar Membro</Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Adicionar Membro</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(handleAddMember)}>
                <Input
                  {...register('name', { required: true })}
                  placeholder="Nome do Membro"
                />
                <Input
                  type="file"
                  {...register('imageFile')}
                  accept="image/*"
                  className="mt-2"
                />
                <DialogFooter className="mt-4">
                  <Button type="submit">Adicionar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <div className="mt-4 w-full max-w-screen-xl mx-auto">
        <div className="relative">
          <Search className="h-4 w-4 absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar membros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto mt-1">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full max-w-screen-xl mx-auto">
          {filteredMembers && filteredMembers.length > 0 ? (
            filteredMembers.map((member: Member) => (
              <div
                key={member.id}
                className="flex items-center justify-between gap-4 border-b py-2"
              >
                <div className="flex items-center gap-4">
                  {member.pictureId && (
                    <Image
                      src={`/images/${member.pictureId}`}
                      alt={member.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div>
                    <h3 className="font-bold">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Editar</Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteMember(member.id)}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full max-w-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <p className="text-center font-bold">
                Nenhum membro foi encontrado 😔
              </p>
              <p className="text-center text-gray-400 text-sm">
                Tente adicionar um novo...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
