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
      console.error('Ocorreu um erro ao buscar os setores', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os setores.',
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
        description: `Setor ${name} criado com sucesso.`,
      })
      return true
    } catch (error) {
      console.error('Erro ao criar setores', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o setor.',
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
        description: `Setor ${name} deletado com sucesso.`,
      })
      return true
    } catch (error) {
      console.error('Erro ao excluir setor', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o setor.',
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
        description: `Setor atualizado com sucesso.`,
      })
      return true
    } catch (error) {
      console.error('Erro ao atualizar o setor', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o setor.',
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
