import { useState, useEffect } from 'react'
import { Department } from '@/interfaces/department'
import { departmentService } from '@/services/department-service'
import { useToast } from '@/hooks/use-toast'

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const fetchDepartments = async () => {
    setLoading(true)
    try {
      const data = await departmentService.getAllDepartments()
      setDepartments(data)
    } catch (error) {
      console.error('Ocorreu um erro ao buscar os departamentos', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os departamentos.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const createDepartment = async (name: string) => {
    try {
      const newDepartment = await departmentService.createDepartment(name)
      setDepartments((prev) => [...prev, newDepartment])
      toast({
        title: 'Sucesso',
        description: `Departamento ${name} criado com sucesso.`,
      })
      return true
    } catch (error) {
      console.error('Erro ao criar departamento', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o departamento.',
        variant: 'destructive',
      })
      return false
    }
  }

  const deleteDepartment = async (id: string, name: string) => {
    setLoading(true)
    try {
      await departmentService.deleteDepartment(id)
      setDepartments((prev) => prev.filter((dep) => dep.id !== id))
      toast({
        title: 'Sucesso',
        description: `Departamento ${name} deletado com sucesso.`,
      })
      return true
    } catch (error) {
      console.error('Erro ao excluir departamento', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o departamento.',
        variant: 'destructive',
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const updateDepartment = async (id: string, name: string) => {
    setLoading(true)
    try {
      await departmentService.updateDepartment(id, name)
      setDepartments((prev) => prev.filter((dep) => dep.id !== id))
      toast({
        title: 'Sucesso',
        description: `Departamento atualizado com sucesso.`,
      })
      return true
    } catch (error) {
      console.error('Erro ao atualizar o departamento', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o departamento.',
        variant: 'destructive',
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  return {
    departments,
    loading,
    createDepartment,
    deleteDepartment,
    updateDepartment,
    refetch: fetchDepartments,
  }
}
