'use client'

import { Button } from '@/components/ui/button'
import { PlusCircle, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/loadingSpinner'
import { Department } from '@/interfaces/department'
import Card from '@/components/card-admin'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const { register, handleSubmit, reset } = useForm<{ name: string }>()

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true)

      try {
        const token = Cookies.get('token')

        if (!token) {
          throw new Error('Token não encontrado')
        }

        const response = await axios.get(`/department/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*',
          },
        })
        const { content } = response.data
        setDepartments(content)
      } catch (error) {
        console.error('Ocorreu um erro ao buscar os departamentos', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os departamentos.',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDepartments()
  }, [])

  const handleCreateDepartment = async (data: { name: string }) => {
    try {
      const token = Cookies.get('token')

      if (!token) throw new Error('Token não encontrado')

      const response = await axios.post(
        `/department/create`,
        { name: data.name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*',
          },
        },
      )

      toast({
        title: 'Sucesso',
        description: `Departamento ${data.name} criado com sucesso.`,
      })
      setDepartments((prev) => [...prev, response.data])
      reset()
    } catch (error) {
      console.error('Erro ao criar departamento', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o departamento.',
      })
    }
  }

  const handleDeleteDepartment = async (id: number, name: string) => {
    setLoading(true)

    try {
      const token = Cookies.get('token')

      if (!token) {
        throw new Error('Token não encontrado')
      }

      await axios.delete(`/department/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*',
        },
      })

      toast({
        title: 'Sucesso',
        description: `Departamento ${name} deletado com sucesso.`,
      })

      setDepartments((prevDepartments: Department[]) =>
        prevDepartments.filter((department) => department.id !== id),
      )
    } catch (error) {
      console.error('Erro ao excluir departamento', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o departamento.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <LoadingSpinner isLoading={loading} />
      <div className="flex flex-col mx-16 bg-slate-50">
        <main className="container sticky top-[56px] z-10 mt-4 px-4 py-4 bg-tile-pattern bg-center bg-repeat rounded-lg w-full max-w-screen-xl">
          <div className="flex justify-between items-center p-2">
            <h2 className="text-2xl font-bold text-white">Departamentos</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Novo
                </Button>
              </DialogTrigger>
              <DialogContent className={`bg-white`}>
                <DialogHeader>
                  <DialogTitle>Criar Departamento</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleCreateDepartment)}>
                  <Input
                    {...register('name', { required: true })}
                    placeholder="Nome do departamento"
                  />
                  <DialogFooter className="mt-4">
                    <Button type="submit">Criar</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </main>
        <div className="mt-4 w-full max-w-screen-xl mx-auto relative">
          <div className="relative">
            <Search className="h-4 w-4 absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar departamentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full max-w-screen-xl mx-auto">
            {departments.filter((dep) =>
              dep.name.toLowerCase().includes(searchTerm.toLowerCase()),
            ).length === 0 ? (
              <div className="w-full max-w-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <p className="text-center font-bold">
                  Nenhum departamento foi encontrado 😔
                </p>
                <p className="text-center text-gray-400 text-sm">
                  Tente criar um novo...
                </p>
              </div>
            ) : (
              departments
                .filter((dep) =>
                  dep.name.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .map((department) => (
                  <Card
                    key={department.id}
                    id={department.id}
                    title={department.name}
                    onView={() =>
                      router.push(`/admin/departments/${department.id}`)
                    }
                    onEdit={() => {}}
                    onDelete={() =>
                      handleDeleteDepartment(department.id, department.name)
                    }
                    element={department.name}
                  />
                ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
