import { Member } from '@/interfaces/member'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { memberService } from '@/services/member-service'
import { useState, useEffect } from 'react'

export default function MemberAvatar({ member }: { member: Member }) {
  const [image, setImage] = useState('')

  useEffect(() => {
    const fetchMemberImage = async () => {
      if (member.pictureId) {
        const data = await memberService.getImage(member.pictureId)
        setImage(`data:image/png;base64,${data.imageBytes}`)
      }
    }

    if (member.pictureId) fetchMemberImage()
  }, [member.pictureId])

  return (
    <>
      <Avatar className="h-16 w-16 mb-2">
        {image && <AvatarImage src={image} alt={member.name} />}
        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span className="text-sm text-center">{member.name}</span>
    </>
  )
}
