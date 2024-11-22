import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, EyeIcon } from 'lucide-react'
interface QuestionnaireCardProps {
  id: number
  title: string
  onView: (id: number) => void
}

const QuestionnaireCard: React.FC<QuestionnaireCardProps> = ({
  id,
  title,
  onView,
}) => {
  return (
    <Card
      key={id}
      className="shadow-[0_1px_1px_rgba(0,0,0,0.04)] hover:shadow-sm transition-shadow cursor-pointer"
      onClick={() => onView(id)}
    >
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary flex-shrink-0" />
            <CardTitle className="break-words whitespace-normal overflow-hidden text-ellipsis">
              {title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

export default QuestionnaireCard
