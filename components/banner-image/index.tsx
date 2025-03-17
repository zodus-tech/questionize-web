'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { questionaryService } from '@/services/questionary-service'

interface BannerImageProps {
  bannerId: string | undefined
}

export default function BannerImage({ bannerId }: BannerImageProps) {
  const [image, setImage] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchBannerImage = async () => {
      if (bannerId) {
        try {
          const data = await questionaryService.getBannerImage(bannerId)
          if (data && data.imageBytes) {
            setImage(`data:image/png;base64,${data.imageBytes}`)
            setError(false)
          } else {
            console.error('Invalid image data received')
            setError(true)
          }
        } catch (err) {
          console.error('Error fetching banner image:', err)
          setError(true)
        }
      }
    }

    if (bannerId) {
      fetchBannerImage()
    } else {
      setImage('')
      setError(false)
    }
  }, [bannerId])

  if (error) return null
  if (!image) return null

  return (
    <div className="w-full mb-6 relative h-40">
      <Image
        src={image}
        alt="Questionnaire Banner"
        fill
        priority
        className="object-cover rounded-lg"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
      />
    </div>
  )
}
