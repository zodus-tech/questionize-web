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

interface DeleteDialogProps {
  handleUpdate: () => void
  handleInputChange: (value: string) => void
  currentValue: string
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
      <AlertDialogTrigger>
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
