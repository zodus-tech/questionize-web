import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import QuestionnaireCard from './card'
import Link from 'next/link'
import { useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { Questionary, QuestionnairesProps } from '@/interfaces/questionary'

const Questionnaires: React.FC<QuestionnairesProps> = ({
  questionnaires = [],
  setQuestionnaires,
}) => {
  const [loading, setLoading] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

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

      setQuestionnaires((prevQuestionnaires: Questionary[]) =>
        prevQuestionnaires.filter((questionary) => questionary.id !== id),
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
      console.log(id, title)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-fit flex flex-col">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-2xl font-bold text-zinc-900">Questionários</h2>
        <Link href={'/formulario/criar'}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo
          </Button>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center">
        {questionnaires.length === 0 ? (
          <div className="w-full max-w-md mx-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <p className="text-center font-bold">
              Nenhum questionário foi encontrado 😔
            </p>
            <p className="text-center text-gray-400 text-sm">
              Tente criar um novo...
            </p>
          </div>
        ) : (
          <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 w-full">
            {questionnaires.map((questionary) => (
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
            ))}
          </div>
        )}
      </div>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <p className="text-white">Excluindo questionário...</p>
        </div>
      )}
    </div>
  )
}

export default Questionnaires
