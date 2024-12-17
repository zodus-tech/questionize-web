import { Member } from '@/interfaces/member'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { memberService } from '@/services/member-service'

export default function MemberItem(member: {
  member: Member
  refetch: () => Promise<void>
}) {
  const { toast } = useToast()
  const [image, setImage] = useState('')

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

      toast({ title: 'Sucesso', description: 'Membro excluído com sucesso.' })
      await member.refetch()
    } catch (error) {
      console.error('Erro ao excluir membro', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o membro.',
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
        <Button variant="outline">Editar</Button>
        <Button
          variant="destructive"
          onClick={() => handleDeleteMember(member.member.id)}
        >
          Excluir
        </Button>
      </div>
    </div>
  )
}
