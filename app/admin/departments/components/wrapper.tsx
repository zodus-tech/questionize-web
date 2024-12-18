'use client'

import { Button } from '@/components/ui/button'
import { PlusCircle, Search } from 'lucide-react'
import LoadingSpinner from '@/components/loadingSpinner'
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

import { Department } from '@/interfaces/department'

import { useForm } from 'react-hook-form'
import { useDepartments } from '@/hooks/use-department'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const {
    departments,
    loading,
    createDepartment,
    deleteDepartment,
    updateDepartment,
    refetch,
  } = useDepartments()
  const router = useRouter()
  const { register, handleSubmit, reset } = useForm<{ name: string }>()

  const handleCreateDepartment = async (data: { name: string }) => {
    const success = await createDepartment(data.name)
    if (success) {
      reset()
    }
  }

  const handleUpdateDepartment = async (id: string, newName: string) => {
    await updateDepartment(id, newName)
    refetch()
  }

  return (
    <>
      <LoadingSpinner isLoading={loading} />
      <div className="flex flex-col mx-4 md:mx-16 bg-slate-50">
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
            {departments.filter((dep: Department) =>
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
                .filter((dep: Department) =>
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
                    onUpdate={handleUpdateDepartment}
                    onDelete={() =>
                      deleteDepartment(department.id, department.name)
                      refetch()
                    }}
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
