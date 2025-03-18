import DeleteDialog from '@/components/deleteDialog'
import { Button } from '@/components/ui/button'
import { FileText, EyeIcon, ChartLineIcon } from 'lucide-react'
import { CardHeader, CardTitle, Card } from '../ui/card'
import UpdateDialog, { UpdateQuestionaryDialog } from '../updateDialog'
import { useState } from 'react'
import { Questionary } from '@/interfaces/questionary'
import { DateRange } from 'react-day-picker'

interface SimpleCardProps {
  id: string
  title: string
  onView: (id: string) => void
  onUpdate?: (id: string, updatedContent: any) => void
  onAnalytics?: (id: string) => void
  onDelete: () => void
  element: string
  questionary?: Questionary
}

const SimpleCard: React.FC<SimpleCardProps> = ({
  id,
  title,
  onView,
  onUpdate,
  onDelete,
  onAnalytics,
  element,
  questionary,
}) => {
  const [updatedContent, setUpdatedContent] = useState<any>(questionary ? 
    {title: questionary.title, startDate: questionary.options.startDate, endDate: questionary.options.endDate} : title)

  const handleInputChange = (value: any) => {
    setUpdatedContent(value)
  }

  const handleQuestionaryTitleChange = (title: string) => {
    const value = {...updatedContent};
    if (title.trim()) {
      value.title = title
    }
    setUpdatedContent(value)
  }
  const handleQuestionaryDatesChange = (dateRange: DateRange | undefined) => {
    const value = {...updatedContent};
    
    if (dateRange && dateRange.from) {
      value.startDate = dateRange.from
    }
    if (dateRange && dateRange.to) {
      value.endDate = dateRange.to
    }
    setUpdatedContent(value)
  }

  const handleUpdate = () => {
    if (onUpdate) {
      onUpdate(id, updatedContent)
    }
  }

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

            {onUpdate && (
              questionary ?
              <UpdateQuestionaryDialog
                handleUpdate={handleUpdate}
                handleTitleInputChange={handleQuestionaryTitleChange}
                handleDateInputChange={handleQuestionaryDatesChange}
                currentValue={updatedContent}
                element={questionary}
              />
              :
              <UpdateDialog
                handleUpdate={handleUpdate}
                handleInputChange={handleInputChange}
                currentValue={updatedContent}
                element={element}
              />
            )}
            <DeleteDialog handleDelete={onDelete} element={element} />
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

export default SimpleCard
