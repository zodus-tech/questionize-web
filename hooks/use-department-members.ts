import { useState, useEffect } from 'react'
import { Department } from '@/interfaces/department'
import { memberService } from '@/services/member-service'
import { useToast } from '@/hooks/use-toast'

export function useDepartmentMembers(departmentId: string) {
  const [department, setDepartment] = useState<Department | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const fetchDepartment = async () => {
    setLoading(true)
    try {
      const data = await memberService.getDepartmentMembers(departmentId)
      setDepartment({
        id: Number(departmentId),
        name: data.name || 'Sem nome',
        members: data.members || [],
      })
    } catch (error) {
      console.error('Erro ao buscar dados do departamento', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar o departamento.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const addMember = async (data: {
    name: string
    role?: string
    imageFile?: FileList
  }) => {
    try {
      const newMember = await memberService.createMember({
        ...data,
        departmentId,
      })

      let pictureId
      if (data.imageFile) {
        const imageResponse = await memberService.uploadImage(data.imageFile, newMember.id)
        pictureId = imageResponse.id
      }

      fetchDepartment()

      toast({
        title: 'Sucesso',
        description: 'Membro adicionado com sucesso.',
      })

      return true
    } catch (error) {
      console.error('Erro ao adicionar membro', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o membro.',
        variant: 'destructive',
      })
      return false
    }
  }

  const deleteMember = async (memberId: number) => {
    try {
      await memberService.deleteMember(memberId)

      setDepartment((prev) =>
        prev
          ? {
            ...prev,
            members: prev.members?.filter((member) => member.id !== memberId),
          }
          : null,
      )

      toast({
        title: 'Sucesso',
        description: 'Membro excluído com sucesso.',
      })
      return true
    } catch (error) {
      console.error('Erro ao excluir membro', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o membro.',
        variant: 'destructive',
      })
      return false
    }
  }

  useEffect(() => {
    fetchDepartment()
  }, [departmentId])

  return {
    department,
    loading,
    addMember,
    deleteMember,
    refetch: fetchDepartment,
  }
}
