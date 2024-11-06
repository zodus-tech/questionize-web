import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import QuestionnaireCard from './card'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface Questionary {
  id: number
  title: string
  description: string
}

interface QuestionnairesProps {
  questionnaires: Questionary[]
}

const Questionnaires: React.FC<QuestionnairesProps> = ({ questionnaires }) => {
  const [fetchedQuestionnaires, setFetchedQuestionnaires] = useState<
    Questionary[]
  >([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      setLoading(true)

      try {
        const token = Cookies.get('token')

        if (!token) {
          throw new Error('Token não encontrado.')
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
        console.error('Ocorreu um erro ao encontrar os questionários.', error)
        setError('Ocorreu um erro ao encontrar os questionários.')
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
        throw new Error('Token não encontrado.')
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

      setFetchedQuestionnaires((prevFetchedQuestionnaires) =>
        prevFetchedQuestionnaires.filter(
          (fetchedQuestionnaires) => fetchedQuestionnaires.id !== id,
        ),
      )
    } catch (error) {
      console.error(
        'Ocorreu um erro inesperado ao excluir o questionário.',
        error,
      )
      toast({
        title: 'Erro',
        description: `Ocorreu um erro inesperado ao excluir o questionário.`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-zinc-900">Questionários</h2>
        <Link href={'/formulario/criar'}>
          <Button onClick={() => router.push(`/formulario/criar`)}>
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
              onView={() => router.push(`/formulario/ver/${questionary.id}`)}
              onEdit={() => {}}
              onDelete={() =>
                handleDeleteForm(questionary.id, questionary.title)
              }
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
