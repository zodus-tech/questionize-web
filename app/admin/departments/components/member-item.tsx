import { Member } from '@/interfaces/member'
import { useToast } from '@/hooks/use-toast'
import { useEffect, useState } from 'react'
import { memberService } from '@/services/member-service'
import UpdateDialog from '@/components/updateDialog'
import DeleteDialog from '@/components/deleteDialog'

export default function MemberItem(member: {
  member: Member
  refetch: () => Promise<void>
  onUpdate?: (id: string, newName: string) => void
  element: string
}) {
  const { toast } = useToast()
  const [image, setImage] = useState('')

  const [newName, setNewName] = useState(member.member.name)

  const handleInputChange = (value: string) => {
    setNewName(value)
  }

  const handleUpdate = () => {
    if (member.onUpdate) {
      member.onUpdate(member.member.id, newName)
    }
  }

  useEffect(() => {
    const fetchMemberImage = async () => {
      if (member.member.pictureId) {
        const data = await memberService.getImage(member.member.pictureId)
        setImage(`data:image/png;base64,${data.imageBytes}`)
      }
    }

    if (member.member.pictureId) fetchMemberImage()
  }, [member.member.pictureId])

  const handleDeleteMember = async (memberId: string) => {
    try {
      await memberService.deleteMember(memberId)

      toast({
        title: 'Sucesso',
        description: 'Atendente excluído com sucesso.',
      })

      member.refetch()
    } catch (error) {
      console.error('Erro ao excluir o atendente', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o atendente.',
      })
    }
  }

  return (
    <div
      key={member.member.id}
      className="flex items-center justify-between gap-4 border-b py-2"
    >
      <div className="flex items-center gap-4">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={member.member.name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full"
          />
        )}
        <div>
          <h3 className="font-bold">{member.member.name}</h3>
          <p className="text-sm text-gray-500">{member.member.role}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <UpdateDialog
          handleUpdate={handleUpdate}
          handleInputChange={handleInputChange}
          currentValue={newName}
          element={member.element}
        />
        <DeleteDialog
          handleDelete={() => handleDeleteMember(member.member.id)}
          element={member.member.name}
        />
      </div>
    </div>
  )
}
