'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import Cookies from 'js-cookie'
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
import { useToast } from '@/hooks/use-toast'
import LoadingSpinner from '@/components/loadingSpinner'
import Image from 'next/image'
import { Department } from '@/interfaces/department'
import { Search } from 'lucide-react'

export default function DepartmentDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const { id: departmentId } = params
  const [department, setDepartment] = useState<Department | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const { register, handleSubmit, reset } = useForm<{
    name: string
    role?: string
    imageFile?: File
  }>()

  useEffect(() => {
    const fetchDepartment = async () => {
      setLoading(true)
      try {
        const token = Cookies.get('token')

        if (!token) {
          throw new Error('Token não encontrado')
        }

        const response = await axios.get(
          `/members/department/${departmentId}/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Access-Control-Allow-Origin': '*',
            },
          },
        )

        const departmentData = {
          id: Number(departmentId),
          name: response.data.departmentName || 'Sem nome',
          members: response.data.members || [],
        }

        setDepartment(departmentData)
      } catch (error) {
        console.error('Erro ao buscar dados do departamento', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar o departamento.',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDepartment()
  }, [departmentId])

  const handleAddMember = async (data: {
    name: string
    role?: string
    imageFile?: File
    pictureId?: string | number
  }) => {
    try {
      const token = Cookies.get('token')
      if (!token) throw new Error('Token não encontrado')

      const formData = new FormData()
      if (data.imageFile) {
        formData.append('imageFile', data.imageFile)
        formData.append(
          'request',
          JSON.stringify({ name: 'foto', memberId: '', questionaryId: null }),
        )

        const imageResponse = await axios.post('/images/save', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*',
          },
        })

        data.pictureId = imageResponse.data.id
      }

      const response = await axios.post(
        '/members/create',
        { ...data, departmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*',
          },
        },
      )

      setDepartment((prev) =>
        prev ? { ...prev, members: [...prev.members, response.data] } : null,
      )
      reset()
      toast({ title: 'Sucesso', description: 'Membro adicionado com sucesso.' })
    } catch (error) {
      console.error('Erro ao adicionar membro', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o membro.',
      })
    }
  }

  const handleDeleteMember = async (memberId: number) => {
    try {
      const token = Cookies.get('token')
      if (!token) throw new Error('Token não encontrado')

      await axios.delete(`/members/delete/${memberId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*',
        },
      })

      setDepartment((prev) =>
        prev
          ? {
              ...prev,
              members: prev.members?.filter((member) => member.id !== memberId),
            }
          : null,
      )
      toast({ title: 'Sucesso', description: 'Membro excluído com sucesso.' })
    } catch (error) {
      console.error('Erro ao excluir membro', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o membro.',
      })
    }
  }

  const filteredMembers = department?.members?.filter((member) =>
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
            filteredMembers.map((member) => (
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
                    onClick={() => handleDeleteMember(member.id)}
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
