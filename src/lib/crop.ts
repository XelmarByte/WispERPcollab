import type { Crop } from 'react-image-crop'

export function getCroppedImage(
  image: HTMLImageElement,
  crop: Crop,
): Promise<Blob> {
  const canvas = document.createElement('canvas')
  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height

  const cropX = crop.x ?? 0
  const cropY = crop.y ?? 0
  const cropWidth = crop.width ?? 0
  const cropHeight = crop.height ?? 0

  canvas.width = cropWidth * scaleX
  canvas.height = cropHeight * scaleY

  const ctx = canvas.getContext('2d')
  if (!ctx)
    throw new Error('Canvas error. Your browser might not support this action')

  ctx.drawImage(
    image,
    cropX * scaleX,
    cropY * scaleY,
    cropWidth * scaleX,
    cropHeight * scaleY,
    0,
    0,
    canvas.width,
    canvas.height,
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else
          reject(new Error('Could not generate image file. Please try again'))
      },
      'image/webp',
      0.85,
    )
  })
}
