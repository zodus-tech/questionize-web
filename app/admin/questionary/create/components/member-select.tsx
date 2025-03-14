import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { departmentService } from '@/services/department-service'
import { Member } from '@/interfaces/member'
import { Department } from '@/interfaces/department'
import { ChevronLeft } from 'lucide-react'

interface MemberSelectProps {
  onMembersChange: (members: Member[]) => void
  selectedDepartmentId: string
}

export const MemberSelect: React.FC<MemberSelectProps> = ({
  onMembersChange,
  selectedDepartmentId,
}) => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([])
  const [open, setOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null)

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departmentsData = await departmentService.getAllDepartments()
        setDepartments(departmentsData)
      } catch (error) {
        console.error('Error fetching departments:', error)
      }
    }

    fetchDepartments()
  }, [])

  const handleMemberToggle = (member: Member) => {
    setSelectedMembers((prevSelected) => {
      if (prevSelected.some((selected) => selected.id === member.id)) {
        const newSelection = prevSelected.filter(
          (selected) => selected.id !== member.id,
        )
        onMembersChange(newSelection)
        return newSelection
      } else {
        const newSelection = [...prevSelected, member]
        onMembersChange(newSelection)
        return newSelection
      }
    })
  }

  const handleDepartmentSelect = (department: Department) => {
    setSelectedDepartment(department)
    if (department.id !== selectedDepartmentId) {
      setSelectedMembers([])
      onMembersChange([])
    }
  }

  const handleBackToDepartments = () => {
    setSelectedDepartment(null)
  }

  const handleSave = () => {
    onMembersChange(selectedMembers)
    setOpen(false)
  }

  const handleSelectAllMembers = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(selectedDepartment?.members || [])
      onMembersChange(selectedDepartment?.members || [])
    } else {
      setSelectedMembers([])
      onMembersChange([])
    }
  }

  useEffect(() => {
    if (selectedDepartmentId) {
      const department = departments.find((d) => d.id === selectedDepartmentId)
      if (department) {
        setSelectedDepartment(department)
      }
      setSelectedMembers((prev) =>
        prev.filter(
          (member) => member.departmentId.toString() === selectedDepartmentId,
        ),
      )
    }
  }, [selectedDepartmentId, departments])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selectedMembers.length > 0
            ? `${selectedMembers.length} atendentes selecionados`
            : 'Selecionar atendentes...'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {selectedDepartment && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToDepartments}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle>
              {selectedDepartment
                ? selectedDepartment.name
                : 'Selecionar Setor'}
            </DialogTitle>
          </div>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[60vh] pr-4">
          {!selectedDepartment ? (
            departments.map((department, index) => (
              <div key={department.id} className="mb-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left h-auto py-3 border shadow-md border-black/50"
                  onClick={() => handleDepartmentSelect(department)}
                >
                  <div>
                    <div className="font-medium">{department.name}</div>
                    <div className="text-sm text-gray-500">
                      {department.members.length} atendentes
                    </div>
                  </div>
                </Button>
                {index !== departments.length - 1 && (
                  <div className="bg-black/10 h-px w-full mt-2" />
                )}
              </div>
            ))
          ) : (
            <div className="space-y-3">
              {selectedDepartment.members.length > 0 ? (
                <>
                  <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg shadow-sm border border-gray-400">
                    <Checkbox
                      id="select-all"
                      checked={
                        selectedDepartment.members.length ===
                        selectedMembers.length
                      }
                      onCheckedChange={(checked) =>
                        handleSelectAllMembers(checked as boolean)
                      }
                    />
                    <label
                      htmlFor="select-all"
                      className="text-sm font-medium leading-none"
                    >
                      Todos
                    </label>
                  </div>
                  <div className="space-y-2">
                    {selectedDepartment.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors border border-gray-400"
                      >
                        <Checkbox
                          id={`member-${member.id}`}
                          checked={selectedMembers.some(
                            (selected) => selected.id === member.id,
                          )}
                          onCheckedChange={() => handleMemberToggle(member)}
                        />
                        <label
                          htmlFor={`member-${member.id}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {member.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg font-medium">
                    Nenhum atendente encontrado
                  </p>
                  <p className="text-sm mt-1">
                    Este setor não possui atendentes cadastrados
                  </p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSave}>Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
