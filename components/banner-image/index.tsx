'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { questionaryService } from '@/services/questionary-service'

interface BannerImageProps {
  imageId: string | undefined
}

export default function BannerImage({ imageId }: BannerImageProps) {
  const [image, setImage] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchBannerImage = async () => {
      if (imageId) {
        try {
          const data = await questionaryService.getBannerImage(imageId)
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

    if (imageId) {
      fetchBannerImage()
    } else {
      setImage('')
      setError(false)
    }
  }, [imageId])

  if (error) return null
  if (!image) return null

  return (
    <div className="aspect-[3/1] w-full mb-6 relative">
      <Image
        src={image}
        alt="Questionnaire Banner"
        fill
        priority
        className="rounded-lg object-cover aspect-3/1"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
      />
    </div>
  )
}
