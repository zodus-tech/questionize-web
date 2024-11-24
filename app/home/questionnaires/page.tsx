'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Questionary } from '@/interfaces/questionary'
import LoadingSpinner from '@/components/loadingSpinner'
import { baseUrl } from '@/utils/endpoints'
import Card from '@/components/card'

axios.defaults.baseURL = baseUrl

export default function QuestionnairesPage() {
  const [questionnaires, setQuestionnaires] = useState<Questionary[]>([])
  const [loading, setLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      setLoading(true)

      try {
        const response = await axios.get(`/questionary/all`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        })
        const { content } = response.data
        setQuestionnaires(content)
      } catch (error) {
        console.error('Ocorreu um erro ao encontrar os questionários', error)
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
      <div className="flex flex-col mx-16 bg-slate-50">
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
                  onEdit={() =>
                    console.log('Não é possível editar o questionário')
                  }
                  onDelete={() =>
                    console.log('Não é possível deletar o questionário')
                  }
                  key={questionary.id}
                  id={questionary.id}
                  title={questionary.title}
                  onView={() =>
                    router.push(
                      `/home/questionarios/responder/${questionary.id}`,
                    )
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
