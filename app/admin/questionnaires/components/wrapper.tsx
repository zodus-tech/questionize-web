'use client'

import { Button } from '@/components/ui/button'
import { PlusCircle, Search } from 'lucide-react' // Importa o ícone de lupa
import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { Questionary } from '@/interfaces/questionary'
import LoadingSpinner from '@/components/loadingSpinner'
import Card from '@/components/card'
import { Input } from '@/components/ui/input'

export default function QuestionnairesPage() {
  const [questionnaires, setQuestionnaires] = useState<Questionary[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      setLoading(true)

      try {
        const token = Cookies.get('token')

        if (!token) {
          throw new Error('Token não encontrado')
        }

        const response = await axios.get(`/questionary/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*',
          },
        })
        const { content } = response.data
        setQuestionnaires(content)
      } catch (error) {
        console.error('Ocorreu um erro ao encontrar os questionários', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os questionários.',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionnaires()
  }, [])

  const handleDeleteForm = async (id: number, title: string) => {
    setLoading(true)

    try {
      const token = Cookies.get('token')

      if (!token) {
        throw new Error('Token não encontrado')
      }

      await axios.delete(`/questionary/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*',
        },
      })

      toast({
        title: 'Delete',
        description: `Questionário ${title} deletado com sucesso`,
      })

      setQuestionnaires((prevQuestionnaires: Questionary[]) =>
        prevQuestionnaires.filter((questionary) => questionary.id !== id),
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
            <h2 className="text-2xl font-bold text-white">Questionários</h2>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo
            </Button>
          </div>
        </main>
        <div className="mt-4 w-full max-w-screen-xl mx-auto relative">
          <div className="relative">
            <Search className="h-4 w-4 absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar questionários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full max-w-screen-xl mx-auto">
            {questionnaires
              .filter((questionary) =>
                questionary.title
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()),
              )
              .map((questionary) => (
                <Card
                  key={questionary.id}
                  id={questionary.id}
                  title={questionary.title}
                  onView={() =>
                    router.push(`/admin/questionary/response/${questionary.id}`)
                  }
                  onEdit={() => {}}
                  onDelete={() =>
                    handleDeleteForm(questionary.id, questionary.title)
                  }
                  element={questionary.title}
                />
              ))}
            {questionnaires.filter((questionary) =>
              questionary.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
            ).length === 0 && (
              <div className="w-full max-w-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <p className="text-center font-bold">
                  Nenhum questionário foi encontrado 😔
                </p>
                <p className="text-center text-gray-400 text-sm">
                  Tente criar um novo...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
