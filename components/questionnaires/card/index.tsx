import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, EyeIcon } from 'lucide-react'
import DeleteQuestionary from '../deleteDialog'

interface QuestionnaireCardProps {
  id: number
  title: string
  onView: (id: number) => void
  onEdit: (id: number) => void
  onDelete: () => void
}

const QuestionnaireCard: React.FC<QuestionnaireCardProps> = ({
  id,
  title,
  onView,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onEdit,
  onDelete,
}) => {
  return (
    <Card key={id} className="hover:shadow-md transition-shadow">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between space-x-4">
          <CardTitle className="flex-1 flex items-center">
            <FileText className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
            <span className="truncate">{title}</span>
          </CardTitle>
          <div className="flex-shrink-0 flex space-x-1">
            <Button variant="ghost" size="icon" onClick={() => onView(id)}>
              <EyeIcon className="h-4 w-4" />
            </Button>
            {/*
            <Button variant="ghost" size="icon" onClick={() => onEdit(id)}>
              <Edit className="h-4 w-4" />
            </Button>
             */}
            {/* <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button> */}
            <DeleteQuestionary handleDeleteQuestionary={onDelete} />
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

export default QuestionnaireCard
