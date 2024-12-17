import { Button } from '@/components/ui/button'
import { FileText, Send } from 'lucide-react'
import { CardHeader, CardTitle, Card } from '../ui/card'

interface SimpleCardProps {
  id: number
  title: string
  onRespond: (id: number) => void
}

const SimpleCard: React.FC<SimpleCardProps> = ({ id, title, onRespond }) => {
  return (
    <Card
      key={id}
      className="shadow-[0_1px_1px_rgba(0,0,0,0.04)] hover:shadow-sm transition-shadow"
    >
      <CardHeader className="p-4">
        <div className="flex items-start justify-between h-fit">
          <div className="flex-1 flex items-center space-x-2 align-middle my-auto">
            <FileText className="h-5 w-5 text-primary flex-shrink-0" />
            <CardTitle className="break-words whitespace-normal overflow-hidden text-ellipsis mb-1">
              {title}
            </CardTitle>
          </div>
          <div className="flex-shrink-0 flex items-center space-x-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-green-600 hover:text-green-800 hover:bg-green-50 flex items-center"
              onClick={() => onRespond(id)}
            >
              <Send className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium mb-0.5">Responder</span>
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

export default SimpleCard
