import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Edit2 } from 'lucide-react'
import { Input } from '../ui/input'
import { DatePickerWithRange } from '../date-picker-with-range'
import { DateRange } from 'react-day-picker'
import { addDays } from 'date-fns'
import { useState } from 'react'
import { Questionary } from '@/interfaces/questionary'

interface DeleteDialogProps {
  handleUpdate: () => void
  handleInputChange: (value: string) => void
  currentValue: any
  element: string
}

export default function UpdateDialog({
  handleUpdate,
  handleInputChange,
  element,
  currentValue,
}: DeleteDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className={`bg-white`}>
        <AlertDialogHeader>
          <AlertDialogTitle>Atualizar o {element}</AlertDialogTitle>
          <AlertDialogDescription>
            Escolha um novo nome para representá-lo
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          value={currentValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Digite o novo nome"
          className="w-full mt-2"
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdate}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

interface UpdateQuestionaryDialogProps {
  handleUpdate: () => void
  handleTitleInputChange: (title: string) => void
  handleDateInputChange: (dateRange: DateRange | undefined) => void
  currentValue: any
  element: Questionary
}

export function UpdateQuestionaryDialog({
  handleUpdate,
  handleTitleInputChange,
  handleDateInputChange,
  currentValue,
  element,
}: UpdateQuestionaryDialogProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: element.options.startDate,
    to: element.options.endDate,
  })

  const handleDateInput = (dateRange: any) => {
    setDateRange(dateRange);
    handleDateInputChange(dateRange)
  }


  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className={`bg-white`}>
        <AlertDialogHeader>
          <AlertDialogTitle>Atualizar o {element.title}</AlertDialogTitle>
          <AlertDialogDescription>
            Escolha um novo nome para representá-lo
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          value={currentValue.title}
          onChange={(e) => handleTitleInputChange(e.target.value)}
          placeholder="Digite o novo nome"
          className="w-full mt-2"
        />

        <AlertDialogHeader>
          <AlertDialogDescription>
            Escolha uma nova data de validade
          </AlertDialogDescription>
        </AlertDialogHeader>
        <DatePickerWithRange
                  date={dateRange}
                  setDate={(e) => handleDateInput(e)}
                  className="justify-self-end w-full"
                  allowPastDates={true}
                />

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdate}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}