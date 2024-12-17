import { useState } from 'react'
import { Member } from '@/interfaces/member'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import MemberAvatar from './member-avatar'

interface MemberSelectorProps {
  members: Member[] | undefined
  onSelect: (member: Member) => void
  selectedMember: Member | undefined
}

export function MemberSelector({
  members,
  onSelect,
  selectedMember,
}: MemberSelectorProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (member: Member) => {
    onSelect(member)
    setOpen(false)
  }

  // const selectedMember = members?.find(
  //   (member) => member.id === selectedMember?.id,
  // )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selectedMember ? (
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage
                  src={selectedMember.pictureId}
                  alt={selectedMember.name}
                />
                <AvatarFallback>{selectedMember.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{selectedMember.name}</span>
            </div>
          ) : (
            'Selecionar membro para avaliar'
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Selecionar Membro</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[60vh] pr-4">
          <div className="grid grid-cols-2 gap-4">
            {members && (
              <>
                {members.map((member) => (
                  <Button
                    key={member.id}
                    variant="outline"
                    className={`flex flex-col items-center p-4 h-auto ${
                      selectedMember === member ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleSelect(member)}
                  >
                    <MemberAvatar member={member} />
                  </Button>
                ))}
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
