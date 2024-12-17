import DeleteDialog from '@/components/deleteDialog'
import { Button } from '@/components/ui/button'
import { FileText, EyeIcon, ChartLineIcon, Edit } from 'lucide-react'
import { CardHeader, CardTitle, Card } from '../ui/card'

interface SimpleCardProps {
  id: number
  title: string
  onView: (id: number) => void
  onEdit?: (id: number) => void
  onAnalytics?: (id: number) => void
  onDelete: () => void
  element: string
}

const SimpleCard: React.FC<SimpleCardProps> = ({
  id,
  title,
  onView,
  onEdit,
  onDelete,
  onAnalytics,
  element,
}) => {
  return (
    <Card
      key={id}
      className="shadow-[0_1px_1px_rgba(0,0,0,0.04)] hover:shadow-sm transition-shadow"
    >
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 flex items-center space-x-2 my-auto">
            <FileText className="h-5 w-5 text-primary flex-shrink-0" />
            <CardTitle className="break-words whitespace-normal overflow-hidden text-ellipsis">
              {title}
            </CardTitle>
          </div>
          <div className="flex-shrink-0 flex space-x-1 ml-2">
            <Button variant="ghost" size="icon" onClick={() => onView(id)}>
              <EyeIcon className="h-4 w-4" />
            </Button>
            {onAnalytics && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onAnalytics(id)}
              >
                <ChartLineIcon className="h-4 w-4" />
              </Button>
            )}

            {onEdit && (
              <Button variant="ghost" size="icon" onClick={() => onEdit(id)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}

            <DeleteDialog handleDelete={onDelete} element={element} />
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

export default SimpleCard
