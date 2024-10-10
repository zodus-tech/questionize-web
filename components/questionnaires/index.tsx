import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import QuestionnaireCard from './card'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

interface Questionary {
  id: number
  title: string
  description: string
}

interface QuestionnairesProps {
  questionnaires: Questionary[]
  handleEditForm: (id: number) => void
  handleViewForm: (id: number) => void
  handleDeleteForm: (id: number) => void
}

const Questionnaires: React.FC<QuestionnairesProps> = ({
  questionnaires,
  handleEditForm,
  handleViewForm,
  handleDeleteForm,
}) => {
  const [fetchedQuestionnaires, setFetchedQuestionnaires] = useState<
    Questionary[]
  >([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      setLoading(true)

      try {
        const token = Cookies.get('token')

        if (!token) {
          throw new Error('No token found')
        }

        const response = await axios.get(`/questionary/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*',
          },
        })
        const { content } = response.data
        setFetchedQuestionnaires(content)
      } catch (error) {
        console.error('Failed to fetch questionnaires', error)
        setError('Failed to fetch questionnaires')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionnaires()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-zinc-900">Questionários</h2>
        <Link href={'/formulario/criar'}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo
          </Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {questionnaires.length === 0 && fetchedQuestionnaires.length === 0 ? (
          <p>Nenhum Questionário encontrado...</p>
        ) : (
          [...questionnaires, ...fetchedQuestionnaires].map((questionary) => (
            <QuestionnaireCard
              key={questionary.id}
              id={questionary.id}
              title={questionary.title}
              description={questionary.description}
              onView={handleViewForm}
              onEdit={handleEditForm}
              onDelete={handleDeleteForm}
            />
          ))
        )}
        {loading && <p>Carregando Questionários...</p>}
        {error && (
          <div className="text-center py-8">
            <p className="text-xl font-semibold text-red-500">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Questionnaires
