'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Check, X, ZoomIn, ZoomOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface BannerUploadProps {
  onBannerChange: (file: File | null) => void
}

// Function to convert a canvas to a Blob/File
function canvasToFile(
  canvas: HTMLCanvasElement,
  filename: string,
  type = 'image/jpeg',
  quality = 0.8,
): Promise<File> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          console.error('Canvas is empty or failed to create blob')
          return
        }
        const file = new File([blob], filename, { type })
        resolve(file)
      },
      type,
      quality,
    )
  })
}

export function BannerUpload({ onBannerChange }: BannerUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  // Image positioning states
  const [isCropping, setIsCropping] = useState(false)
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [imgSrc, setImgSrc] = useState('')
  const imgRef = useRef<HTMLImageElement>(null)
  const cropAreaRef = useRef<HTMLDivElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)

  // Image position and zoom
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [isDraggingImage, setIsDraggingImage] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 })

  // Image natural dimensions
  const [naturalDimensions, setNaturalDimensions] = useState({
    width: 0,
    height: 0,
  })

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
      handleInitialFile(file)
    }
  }

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith('image/')) {
      setFileError('Por favor, selecione apenas arquivos de imagem.')
      return false
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setFileError('A imagem deve ter menos de 5MB.')
      return false
    }

    setFileError(null)
    return true
  }

  // Initial file handling - validate and set up for cropping
  const handleInitialFile = (file: File) => {
    if (!validateFile(file)) {
      return
    }

    setSourceFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      setImgSrc(reader.result as string)
      setIsCropping(true)
      setPosition({ x: 0, y: 0 })
      setZoom(1)
    }
    reader.readAsDataURL(file)

    console.log('File selected for banner upload:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      lastModified: new Date(file.lastModified).toISOString(),
    })
  }

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleInitialFile(e.target.files[0])
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
    setFileError(null)
    setIsCropping(false)
    setImgSrc('')
    setSourceFile(null)
    setPosition({ x: 0, y: 0 })
    setZoom(1)
    onBannerChange(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handle mouseDown for dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return

    e.preventDefault()
    setIsDraggingImage(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    setInitialPosition({ ...position })
  }

  // Handle mouseMove for dragging
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingImage || !cropAreaRef.current) return

      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y

      // Calculate new position
      const newPosition = {
        x: initialPosition.x + deltaX,
        y: initialPosition.y + deltaY,
      }

      setPosition(newPosition)
    },
    [isDraggingImage, dragStart, initialPosition],
  )

  // Handle mouseUp to end dragging
  const handleMouseUp = useCallback(() => {
    setIsDraggingImage(false)
  }, [])

  // Add and remove event listeners for dragging
  useEffect(() => {
    if (isDraggingImage) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDraggingImage, handleMouseMove, handleMouseUp])

  // Handle image load to get natural dimensions
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    setNaturalDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight,
    })
  }

  // Increase zoom
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3))
  }

  // Decrease zoom
  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5))
  }

  // When user confirms the crop
  const handleFinishCrop = async () => {
    if (
      !imgRef.current ||
      !cropAreaRef.current ||
      !previewCanvasRef.current ||
      !sourceFile
    ) {
      return
    }

    const cropArea = cropAreaRef.current
    const img = imgRef.current

    const canvas = previewCanvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    // Set fixed dimensions for the output banner
    const canvasWidth = 1200 // Higher resolution for better quality
    const canvasHeight = 400 // 3:1 aspect ratio
    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // Get dimensions of both the crop area and the image
    const cropRect = cropArea.getBoundingClientRect()
    const imgRect = img.getBoundingClientRect()

    // Calculate the visible portion of the image (accounting for zoom and position)
    const scale = (naturalDimensions.width / imgRect.width) * (1 / zoom)

    // Calculate the position of the crop area relative to the image
    const relativeLeft = (imgRect.left + position.x - cropRect.left) * -1
    const relativeTop = (imgRect.top + position.y - cropRect.top) * -1

    // Convert to original image coordinates (accounting for zoom)
    const sourceX = relativeLeft * scale
    const sourceY = relativeTop * scale
    const sourceWidth = cropRect.width * scale
    const sourceHeight = cropRect.height * scale

    console.log('Crop parameters:', {
      zoom,
      position,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      naturalWidth: naturalDimensions.width,
      naturalHeight: naturalDimensions.height,
      imgRectWidth: imgRect.width,
      imgRectHeight: imgRect.height,
      cropRectWidth: cropRect.width,
      cropRectHeight: cropRect.height,
      scale: scale,
    })

    // Draw the image to the canvas using the calculated coordinates
    try {
      ctx.fillStyle = '#f0f0f0' // Background color in case of transparent images
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        canvasWidth,
        canvasHeight,
      )

      // Convert canvas to file
      const croppedFile = await canvasToFile(
        canvas,
        sourceFile.name,
        'image/jpeg', // Use JPEG for consistent results
        0.9, // High quality
      )
      const croppedUrl = URL.createObjectURL(croppedFile)

      setPreviewUrl(croppedUrl)
      setIsCropping(false)
      onBannerChange(croppedFile)
    } catch (error) {
      console.error('Error creating cropped file:', error)
      setFileError('Erro ao processar a imagem. Tente novamente.')
    }
  }

  // Cancel cropping
  const handleCancelCrop = () => {
    setIsCropping(false)
    setImgSrc('')
    setSourceFile(null)
    setPosition({ x: 0, y: 0 })
    setZoom(1)
  }

  // Handle edit button click from preview state
  const handleEditImage = () => {
    // If we have the original file, go back to cropping state with it
    if (sourceFile) {
      setIsCropping(true)
      setPosition({ x: 0, y: 0 })
      setZoom(1)

      // If we don't have the imgSrc anymore, reload it from the file
      if (!imgSrc) {
        const reader = new FileReader()
        reader.onload = () => {
          setImgSrc(reader.result as string)
        }
        reader.readAsDataURL(sourceFile)
      }
    } else {
      // If we don't have the source file anymore, open file dialog
      fileInputRef.current?.click()
    }

    // Clear the preview URL if it exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  return (
    <div className="w-full">
      {!isCropping && !previewUrl ? (
        <div className="flex flex-col">
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
          {fileError && (
            <p className="text-red-500 text-sm mt-2">{fileError}</p>
          )}
        </div>
      ) : isCropping ? (
        <div className="flex flex-col">
          <div className="text-center mb-3">
            <h3 className="text-lg font-semibold mb-1">Ajuste o banner</h3>
            <p className="text-sm text-gray-500">
              Arraste a imagem para posicioná-la corretamente
            </p>
          </div>

          {/* Crop viewport area */}
          <div className="bg-gray-100 rounded-lg p-4 mb-4 overflow-hidden">
            <div className="relative mx-auto" style={{ maxWidth: '100%' }}>
              {/* Fixed aspect ratio container */}
              <div
                ref={cropAreaRef}
                className="relative overflow-hidden rounded"
                style={{
                  width: '100%',
                  paddingTop: '33.33%' /* 3:1 aspect ratio */,
                  background: '#f0f0f0',
                  border: '1px solid #ddd',
                  cursor: isDraggingImage ? 'grabbing' : 'grab',
                }}
                onMouseDown={handleMouseDown}
              >
                {imgSrc && (
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                    <img
                      ref={imgRef}
                      src={imgSrc}
                      alt="Banner para ajustar"
                      onLoad={handleImageLoad}
                      style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                        transformOrigin: 'center',
                        maxWidth: 'none',
                        maxHeight: 'none',
                        willChange: 'transform',
                      }}
                      draggable={false}
                    />
                  </div>
                )}
              </div>

              {/* Zoom controls */}
              <div className="flex justify-center gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                >
                  <ZoomOut size={16} />
                </Button>
                <span className="py-1 px-2 bg-white rounded border border-gray-200 text-sm">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                >
                  <ZoomIn size={16} />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              onClick={handleCancelCrop}
              variant="outline"
              className="flex gap-1 items-center"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button
              onClick={handleFinishCrop}
              className="bg-green-500 hover:bg-green-600 text-white flex gap-1 items-center"
            >
              <Check className="h-4 w-4" />
              Aplicar
            </Button>
          </div>
          {/* Hidden canvas for cropping */}
          <canvas ref={previewCanvasRef} style={{ display: 'none' as const }} />
        </div>
      ) : (
        <div className="relative w-full aspect-[3/1]">
          {previewUrl && (
            <Image
              src={previewUrl}
              alt="Banner preview"
              fill
              className=" rounded-lg"
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50 rounded-lg">
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={handleEditImage}>
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
