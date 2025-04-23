'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Questionary } from '@/interfaces/questionary'
import LoadingSpinner from '@/components/loadingSpinner'
import { baseUrl } from '@/utils/endpoints'
import Card from '@/components/card-anonymous'
import Watermark from '@/components/footer-watermark'
import { questionaryService } from '@/services/questionary-service'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

axios.defaults.baseURL = baseUrl

export default function QuestionnairesPage() {
  const [questionnaires, setQuestionnaires] = useState<Questionary[]>([])
  const [loading, setLoading] = useState(false)
  const [, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [, setTotalElements] = useState(0)
  const [size] = useState(24)

  const router = useRouter()

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await questionaryService.getAllQuestionnaires(
          undefined,
          true,
          page,
          size,
        )
        setQuestionnaires(response.content)
        setTotalPages(response.page.totalPages)
        setTotalElements(response.page.totalElements)
      } catch (err) {
        console.error('Ocorreu um erro ao encontrar os questionários', err)
        setError('Ocorreu um erro ao encontrar os questionários')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionnaires()
  }, [page, size])

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
      <div className="relative flex flex-col mx-4 md:mx-16 bg-slate-50 min-h-screen">
        <main className="container sticky top-[56px] z-10 mt-16 px-4 py-4 bg-tile-pattern bg-center bg-repeat rounded-lg w-full max-w-screen-xl">
          <div className="flex justify-between items-center p-2">
            <h2 className="text-2xl font-bold text-white">Questionários</h2>
          </div>
        </main>
        <div className="flex-1 overflow-auto mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full max-w-screen-xl mx-auto">
            {questionnaires.length === 0 ? (
              <div className="w-full max-w-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <p className="text-center font-bold">
                  Nenhum questionário foi encontrado 😔
                </p>
                <p className="text-center text-gray-400 text-sm">
                  Contate o administrador do sistema para mais informações...
                </p>
              </div>
            ) : (
              questionnaires.map((questionary) => (
                <Card
                  key={questionary.id}
                  id={questionary.id}
                  title={questionary.title}
                  onRespond={() =>
                    router.push(
                      `/home/questionnaires/response/${questionary.id}`,
                    )
                  }
                />
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {questionnaires.length > 0 && (
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
        <Watermark />
      </div>
    </>
  )
}
