'use client'

import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/loadingSpinner'
import { Department } from '@/interfaces/department'
import Card from '@/components/card'

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null)

  const { toast } = useToast()
  const router = useRouter()

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
        console.error('Ocorreu um erro ao encontrar os questionários', error)
        setError('Ocorreu um erro ao encontrar os questionários')
      } finally {
        setLoading(false)
      }
    }

    fetchDepartments()
  }, [])

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
        title: 'Delete',
        description: `Departamento ${name} deletado com sucesso`,
      })

      setDepartments((prevDepartments: Department[]) =>
        prevDepartments.filter((department) => department.id !== id),
      )
    } catch (error) {
      console.error(
        'Ocorreu um erro inesperado ao excluir o questionário',
        error,
      )
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado ao excluir o questionário',
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
            <Link href={'/admin/questionary/create'}>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo
              </Button>
            </Link>
          </div>
        </main>
        <div className="flex-1 overflow-auto mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full max-w-screen-xl mx-auto">
            {departments.length === 0 ? (
              <div className="w-full max-w-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <p className="text-center font-bold">
                  Nenhum departamento foi encontrado 😔
                </p>
                <p className="text-center text-gray-400 text-sm">
                  Tente criar um novo...
                </p>
              </div>
            ) : (
              departments.map((department) => (
                <Card
                  key={department.id}
                  id={department.id}
                  title={department.name}
                  onView={() =>
                    router.push(`/admin/questionary/response/${department.id}`)
                  }
                  onEdit={() => {}}
                  onDelete={() =>
                    handleDeleteDepartment(department.id, department.name)
                  }
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
