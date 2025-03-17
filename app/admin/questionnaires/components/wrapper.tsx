'use client'

import { Button } from '@/components/ui/button'
import { PlusCircle, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { Questionary } from '@/interfaces/questionary'
import LoadingSpinner from '@/components/loadingSpinner'
import Card from '@/components/card-admin'
import { Input } from '@/components/ui/input'
import { questionaryService } from '@/services/questionary-service'
import Link from 'next/link'
import { ToastAction } from '@/components/ui/toast'

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
        const data = await questionaryService.getAllQuestionnaires()
        setQuestionnaires(data)
      } catch (err) {
        console.error('Ocorreu um erro ao encontrar os questionários', err)
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os questionários.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionnaires()
  }, [toast])

  const handleDeleteForm = async (id: string, title: string) => {
    setLoading(true)

    try {
      const success = await questionaryService.deleteQuestionnaire(id)
      if (success) {
        toast({
          title: 'Deletado',
          description: `Questionário ${title} deletado com sucesso`,
        })

        setQuestionnaires((prevQuestionnaires: Questionary[]) =>
          prevQuestionnaires.filter(
            (questionary) => questionary.id !== id.toString(),
          ),
        )
      } else {
        toast({
          variant: 'destructive',
          title: 'Falha',
          description: `Não foi possível deletar o questionário ${title}, tente novamente mais tarde`,
          action: (
            <ToastAction
              altText="Tentar novamente"
              onClick={() => {
                handleDeleteForm(id, title)
              }}
            >
              Tentar novamente
            </ToastAction>
          ),
        })
      }
    } catch (error) {
      console.error(
        'Ocorreu um erro inesperado ao excluir o questionário',
        error,
      )
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado ao excluir o questionário',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRenameForm = async (id: string, newTitle: string) => {
    if (!newTitle.trim()) {
      toast({
        title: 'Erro de Validação',
        description: 'O título do questionário não pode estar vazio.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const success = await questionaryService.renameQuestionnaire(id, newTitle)
      if (success) {
        toast({
          title: 'Renomeado',
          description: `Questionário renomeado com sucesso`,
        })

        setQuestionnaires((prevQuestionnaires: Questionary[]) =>
          prevQuestionnaires.map((questionary) =>
            questionary.id === id.toString()
              ? { ...questionary, title: newTitle }
              : questionary,
          ),
        )
      } else {
        toast({
          variant: 'destructive',
          title: 'Falha',
          description: `Não foi possível renomear o questionário, tente novamente mais tarde`,
          action: (
            <ToastAction
              altText="Tentar novamente"
              onClick={() => {
                handleRenameForm(id, newTitle)
              }}
            >
              Tentar novamente
            </ToastAction>
          ),
        })
      }
    } catch (error) {
      console.error(
        'Ocorreu um erro inesperado ao renomear o questionário',
        error,
      )
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado ao renomear o questionário',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <LoadingSpinner isLoading={loading} />
      <div className="flex flex-col mx-4 md:mx-16 bg-slate-50">
        <main className="container sticky top-[56px] z-10 mt-4 px-4 py-4 bg-tile-pattern bg-center bg-repeat rounded-lg w-full max-w-screen-xl">
          <div className="flex justify-between items-center p-2">
            <h2 className="text-2xl font-bold text-white">Questionários</h2>
            <Link href={'/admin/questionary/create'}>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo
              </Button>
            </Link>
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
                  onAnalytics={() =>
                    router.push(
                      `/admin/questionary/analytics/${questionary.id}`,
                    )
                  }
                  onDelete={() =>
                    handleDeleteForm(questionary.id, questionary.title)
                  }
                  onUpdate={handleRenameForm}
                  element={questionary.title}
                />
              ))}
            {questionnaires.filter((questionary) =>
              questionary.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
            ).length === 0 && (
              <div className="w-[100vw] h-[100vh] absolute top-0 left-0 flex justify-center items-center flex-col">
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
