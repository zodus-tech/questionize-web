'use client'

import { Button } from '@/components/ui/button'
import { PlusCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react'
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
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [, setTotalElements] = useState(0)
  const [size] = useState(12)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      setLoading(true)

      try {
        const response = await questionaryService.getAllQuestionnaires(
          undefined,
          undefined,
          page,
          size,
        )
        setQuestionnaires(response.content)
        setTotalPages(response.page.totalPages)
        setTotalElements(response.page.totalElements)
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
  }, [toast, page, size])

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

  const handleUpdateForm = async (
    id: string,
    updatedContent: { title: string; startDate: Date; endDate: Date },
  ) => {
    if (updatedContent.title && !updatedContent.title.trim()) {
      toast({
        title: 'Erro de Validação',
        description: 'O título do questionário não pode estar vazio.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const success = await questionaryService.updateQuestionnaire(
        id,
        updatedContent,
      )
      if (success) {
        toast({
          title: 'Atualizado',
          description: `Questionário atualizado com sucesso`,
        })

        setQuestionnaires((prevQuestionnaires: Questionary[]) =>
          prevQuestionnaires.map((questionary) =>
            questionary.id === id.toString()
              ? { ...questionary, title: updatedContent.title }
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
                handleUpdateForm(id, updatedContent)
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

  // Filter questionnaires based on search term
  const filteredQuestionnaires = questionnaires.filter((questionary) =>
    questionary.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Pagination handlers
  const handlePreviousPage = () => {
    if (page > 0) setPage(page - 1)
  }

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1)
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
            {filteredQuestionnaires.length > 0 ? (
              filteredQuestionnaires.map((questionary) => (
                <Card
                  questionary={questionary}
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
                  onUpdate={handleUpdateForm}
                  element={questionary.title}
                />
              ))
            ) : (
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

          {/* Pagination Controls */}
          {filteredQuestionnaires.length > 0 && (
            <div className="flex justify-center items-center mt-6 mb-4 space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={page === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Página {page + 1} de {Math.max(1, totalPages)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={page >= totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
