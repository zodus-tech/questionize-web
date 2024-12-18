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

axios.defaults.baseURL = baseUrl

export default function QuestionnairesPage() {
  const [questionnaires, setQuestionnaires] = useState<Questionary[]>([])
  const [loading, setLoading] = useState(false)
  const [, setError] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await questionaryService.getAllQuestionnaires()
        setQuestionnaires(data)
      } catch (err) {
        console.error('Ocorreu um erro ao encontrar os questionários', err)
        setError('Ocorreu um erro ao encontrar os questionários')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionnaires()
  }, [])

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
        </div>
        <Watermark />
      </div>
    </>
  )
}
