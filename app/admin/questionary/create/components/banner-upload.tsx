'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BannerUploadProps {
  onBannerChange: (file: File | null) => void
}

export function BannerUpload({ onBannerChange }: BannerUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      handleFileChange(file)
    }
  }

  const handleFileChange = (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.')
      return
    }

    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    // Call the callback
    onBannerChange(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0])
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    onBannerChange(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full">
      {!previewUrl ? (
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragging
              ? 'border-primary bg-primary/10'
              : 'border-gray-200 hover:border-primary/50',
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <div className="flex flex-col items-center">
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm font-medium mb-1">
              Arraste e solte ou clique para selecionar
            </p>
            <p className="text-xs text-gray-500">
              Formatos suportados: JPG, PNG, GIF (máx. 5MB)
            </p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileInputChange}
          />
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Banner preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50 rounded-lg">
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={handleBrowseClick}>
                Alterar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleRemoveImage}
              >
                Remover
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
