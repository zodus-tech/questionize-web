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
      if (
        prevSelected.length > 0 &&
        member.departmentId.toString() !==
          prevSelected[0].departmentId.toString()
      ) {
        const newSelection = [member]
        onMembersChange(newSelection)
        return newSelection
      }

      if (prevSelected.some((selected) => selected.id === member.id)) {
        const newSelection = prevSelected.filter(
          (selected) => selected.id !== member.id,
        )
        if (newSelection.length === 0) {
          onMembersChange(newSelection)
        }
        return newSelection
      } else {
        return [...prevSelected, member]
      }
    })
  }

  const handleDepartmentToggle = (department: Department) => {
    setSelectedMembers((prevSelected) => {
      if (selectedDepartmentId && department.id !== selectedDepartmentId) {
        const newSelection = [...department.members]
        onMembersChange(newSelection)
        return newSelection
      }

      const departmentMemberIds = department.members.map((member) => member.id)
      const isFullySelected = department.members.every((member) =>
        prevSelected.some((selected) => selected.id === member.id),
      )

      if (isFullySelected) {
        const newSelection = prevSelected.filter(
          (member) => !departmentMemberIds.includes(member.id),
        )
        if (newSelection.length === 0) {
          onMembersChange(newSelection)
        }
        return newSelection
      } else {
        return [...prevSelected, ...department.members]
      }
    })
  }

  const handleSave = () => {
    onMembersChange(selectedMembers)
    setOpen(false)
  }

  useEffect(() => {
    if (selectedDepartmentId) {
      setSelectedMembers((prev) =>
        prev.filter(
          (member) => member.departmentId.toString() === selectedDepartmentId,
        ),
      )
    }
  }, [selectedDepartmentId])

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
          <DialogTitle>Selecionar Atendentes</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[60vh] pr-4">
          {departments.map((department, index) => (
            <div key={department.id} className="mb-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`department-${department.id}`}
                  checked={department.members.every((member) =>
                    selectedMembers.some(
                      (selected) => selected.id === member.id,
                    ),
                  )}
                  onCheckedChange={() => handleDepartmentToggle(department)}
                />
                <label
                  htmlFor={`department-${department.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {department.name}
                </label>
              </div>
              <div className="ml-6 mt-2 space-y-2 mb-2">
                {department.members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-2">
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
              {index !== departments.length - 1 && (
                <div className="bg-black/50 h-px w-full" />
              )}
            </div>
          ))}
        </ScrollArea>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSave}>Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
