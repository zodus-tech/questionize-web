import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import QuestionnaireCard from './card'
import Link from 'next/link'

interface Form {
  id: number
  title: string
  description: string
}

interface QuestionnairesProps {
  forms: Form[]
  handleEditForm: (id: number) => void
  handleViewForm: (id: number) => void
  handleDeleteForm: (id: number) => void
}

const Questionnaires: React.FC<QuestionnairesProps> = ({
  forms,
  handleEditForm,
  handleViewForm,
  handleDeleteForm,
}) => {
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
        {forms.map((form) => (
          <QuestionnaireCard
            key={form.id}
            id={form.id}
            title={form.title}
            description={form.description}
            onView={handleViewForm}
            onEdit={handleEditForm}
            onDelete={handleDeleteForm}
          />
        ))}
      </div>
    </div>
  )
}

export default Questionnaires
