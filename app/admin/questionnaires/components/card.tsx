import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, EyeIcon } from 'lucide-react'
import DeleteQuestionary from './deleteDialog'

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
    <Card
      key={id}
      className="shadow-[0_1px_1px_rgba(0,0,0,0.04)] hover:shadow-sm transition-shadow"
    >
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary flex-shrink-0" />
            <CardTitle className="break-words whitespace-normal overflow-hidden text-ellipsis">
              {title}
            </CardTitle>
          </div>
          <div className="flex-shrink-0 flex space-x-1 ml-2">
            <Button variant="ghost" size="icon" onClick={() => onView(id)}>
              <EyeIcon className="h-4 w-4" />
            </Button>
            {/* Uncomment this button if needed */}
            {/* 
            <Button variant="ghost" size="icon" onClick={() => onEdit(id)}>
              <Edit className="h-4 w-4" />
            </Button> 
            */}
            <DeleteQuestionary handleDeleteQuestionary={onDelete} />
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

export default QuestionnaireCard