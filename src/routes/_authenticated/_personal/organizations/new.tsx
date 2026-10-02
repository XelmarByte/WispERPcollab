import type { Crop } from 'react-image-crop'
import ReactCrop from 'react-image-crop'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CardBox } from '@/components/card-box'
import { toastManager } from '@/components/ui-utils/toast'
import { getCroppedImage } from '@/lib/crop'
import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import { cn, generateSlug } from '@/lib/utils'
import { PencilIcon, ChevronRightIcon, ArrowLeftIcon } from 'lucide-react'
import {
  centerCrop,
  makeAspectCrop,
  convertToPixelCrop,
} from 'react-image-crop'
import {
  maxLogoSize,
  minDimension,
  maxAspectRatio,
  minAspectRatio,
} from '@/lib/config'
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogClose,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogDescription,
} from '@/components/ui/dialog'

export const Route = createFileRoute(
  '/_authenticated/_personal/organizations/new',
)({
  component: function RouteComponent() {
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 'success'>(1)
    const [logoUrl, setLogoUrl] = useState<string>()
    const [logoFile, setLogoFile] = useState<File>()
    const [orgName, setOrgName] = useState('')

    const fileInputRef = useRef<HTMLInputElement>(null)
    const rawLogoRef = useRef<HTMLImageElement>(null)
    const [crop, setCrop] = useState<Crop>()
    const [openCropper, setOpenCropper] = useState(false)
    const [rawLogoUrl, setRawLogoUrl] = useState<string>()
    const [alertOpen, setAlertOpen] = useState(false)

    console.log(logoFile)

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      if (!file.type.startsWith('image/')) {
        toastManager.add({
          type: 'error',
          title: 'Please select a valid image file',
        })
        e.target.value = ''
        return
      }

      if (file.size > maxLogoSize * 1024 * 1024) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
        toastManager.add({
          type: 'error',
          title: `The logo size (${sizeMB}MB) exceeds the maximum limit of ${maxLogoSize}MB`,
        })
        e.target.value = ''
        return
      }

      const imageUrl = URL.createObjectURL(file)
      e.target.value = ''
      const imageElement = new Image()
      imageElement.src = imageUrl

      imageElement.onload = () => {
        const { naturalWidth, naturalHeight } = imageElement
        const ratio = naturalWidth / naturalHeight

        if (ratio < minAspectRatio) {
          toastManager.add({
            type: 'error',
            title: 'Image is too narrow for the required format',
          })
          URL.revokeObjectURL(imageUrl)
          return
        }

        if (ratio > maxAspectRatio) {
          toastManager.add({
            type: 'error',
            title: 'Image is too wide for the required format',
          })
          URL.revokeObjectURL(imageUrl)
          return
        }

        if (naturalWidth < minDimension || naturalHeight < minDimension) {
          toastManager.add({
            type: 'error',
            title: `Image resolution is too low. Minimum required: ${minDimension}x${minDimension}px`,
          })
          URL.revokeObjectURL(imageUrl)
          return
        }

        setRawLogoUrl(imageUrl)
        setOpenCropper(true)
      }

      imageElement.onerror = () => {
        toastManager.add({
          type: 'error',
          title: 'Failed to load image. Please try again',
        })
        URL.revokeObjectURL(imageUrl)
      }
    }

    const onLogoLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const { width, height } = e.currentTarget
      const crop = makeAspectCrop(
        {
          unit: '%',
          width: 100,
        },
        1,
        width,
        height,
      )
      const centeredCrop = centerCrop(crop, width, height)
      setCrop(centeredCrop)
    }

    const handleCropLogo = async () => {
      if (!rawLogoRef.current || !crop?.width || !crop?.height || !rawLogoUrl) {
        throw new Error('Unable to process image. Please try again')
      }

      const blob = await getCroppedImage(
        rawLogoRef.current,
        convertToPixelCrop(
          crop,
          rawLogoRef.current.width,
          rawLogoRef.current.height,
        ),
      )

      const file = new File([blob], 'logo.webp', { type: 'image/webp' })
      setLogoFile(file)
      setLogoUrl(URL.createObjectURL(file))
      setOpenCropper(false)
    }

    return (
      <>
        {currentStep !== 'success' ? (
          <section className="flex items-center gap-2 mb-6">
            <span className="text-sm font-medium text-muted-foreground">
              Paso {currentStep} de 4
            </span>
            <div className="flex gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i + 1 === currentStep
                      ? 'w-6 bg-foreground'
                      : i + 1 < currentStep
                        ? 'w-2 bg-foreground/10'
                        : 'w-2 bg-foreground/25'
                  }`}
                />
              ))}
            </div>
          </section>
        ) : (
          <div>Pantalla de pago completado</div>
        )}

        {currentStep === 1 && (
          <>
            <section className="text-center flex flex-col gap-1">
              <h1 className="font-bold text-xl">
                Crear una nueva organización
              </h1>
              <p className="max-w-80 text-sm/tight text-muted-foreground ">
                Configura el espacio de trabajo central para tus proyectos y
                colaboradores.
              </p>
            </section>

            <div
              className={cn(
                'rounded-full size-32 border my-6 relative bg-muted flex items-center justify-center',
                !logoUrl &&
                  'bg-linear-to-tr from-purple-500 via-pink-500 to-yellow-400',
              )}
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Preview"
                  className="size-full rounded-full"
                />
              ) : (
                <div className="text-3xl font-bold text-white">
                  {orgName.charAt(0).toUpperCase()}
                </div>
              )}
              <Button
                size="icon-sm"
                className="absolute right-0 bottom-0 rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <PencilIcon />
              </Button>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              hidden
              onChange={handleImage}
            />

            <Dialog
              open={openCropper}
              onOpenChange={(o) => {
                if (!o) {
                  setAlertOpen(true)
                  return
                }
                setOpenCropper(o)
              }}
              onOpenChangeComplete={(o) => {
                if (!o && rawLogoUrl) {
                  URL.revokeObjectURL(rawLogoUrl)
                  setRawLogoUrl(undefined)
                }
              }}
            >
              <DialogPopup className="max-w-3xl" showCloseButton={false}>
                <DialogHeader>
                  <DialogTitle>Crop your photo</DialogTitle>
                  <DialogDescription>
                    Adjust your image to fit the profile frame
                  </DialogDescription>
                </DialogHeader>

                <DialogPanel className="flex flex-col gap-4">
                  <div className="flex justify-center">
                    {rawLogoUrl && (
                      <ReactCrop
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        crop={crop}
                        aspect={1}
                        circularCrop
                        keepSelection
                        minWidth={minDimension}
                      >
                        <img
                          src={rawLogoUrl}
                          ref={rawLogoRef}
                          style={{ maxHeight: '50vh' }}
                          alt=""
                          onLoad={onLogoLoad}
                        />
                      </ReactCrop>
                    )}
                  </div>
                </DialogPanel>

                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>
                    Cancel
                  </DialogClose>
                  <Button onClick={handleCropLogo}>Aceptar</Button>
                </DialogFooter>
              </DialogPopup>

              <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogPopup>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Discard edits?</AlertDialogTitle>
                    <AlertDialogDescription>
                      If you leave now, your photo adjustments will not be saved
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogClose render={<Button variant="outline" />}>
                      Keep editing
                    </AlertDialogClose>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setAlertOpen(false)
                        setOpenCropper(false)
                      }}
                    >
                      Discard changes
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogPopup>
              </AlertDialog>
            </Dialog>

            <section className="w-full max-w-sm flex flex-col">
              <Input
                autoFocus
                onValueChange={(v) => {
                  if (v.startsWith(' ')) return
                  let cleaned = v
                    .replace(/\s{2,}/g, ' ')
                    .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ'\s&\-.]/g, '')

                  if (
                    cleaned.length > 0 &&
                    !/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ]/.test(cleaned)
                  ) {
                    return
                  }

                  cleaned = cleaned
                    .replace(/-{2,}/g, '-')
                    .replace(/\.{2,}/g, '.')
                    .replace(/&{2,}/g, '&')
                    .replace(/'{2,}/g, "'")

                  setOrgName(cleaned)
                }}
                value={orgName}
                placeholder="Nombre de la empresa"
                size="lg"
                spellCheck={false}
                autoComplete="off"
              />
              <div className="text-sm flex justify-end items-center mt-1">
                <span className="text-info">
                  wispzyron.com/w/{generateSlug(orgName)}
                </span>
              </div>
              <Button
                className="mt-4"
                disabled={orgName.length < 2}
                onClick={() => setCurrentStep(2)}
              >
                Continuar <ChevronRightIcon />
              </Button>
            </section>
          </>
        )}

        {currentStep === 2 && (
          <>
            <section className="text-center flex flex-col gap-1">
              <h1 className="font-bold text-xl">Selecciona un plan</h1>
              <p className="max-w-80 text-sm/tight text-muted-foreground ">
                Escala los recursos que necesitará {orgName}.
              </p>
            </section>

            <section className="w-full max-w-sm flex flex-col">
              <div className="flex flex-col gap-3 my-4">
                <CardBox className="p-4">Starter</CardBox>
                <CardBox className="p-4">Pro</CardBox>
                <CardBox className="p-4">Enterprise</CardBox>
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setCurrentStep(1)}>
                  <ArrowLeftIcon />
                  Volver
                </Button>
                <Button onClick={() => setCurrentStep(3)}>
                  Continuar <ChevronRightIcon />
                </Button>
              </div>
            </section>
          </>
        )}

        {currentStep === 3 && (
          <>
            <section className="text-center flex flex-col gap-1">
              <h1 className="font-bold text-xl">Método de pago</h1>
              <p className="max-w-80 text-sm/tight text-muted-foreground ">
                Elige cómo deseas gestionar los cobros para la suscripción de tu
                workspace.
              </p>
            </section>

            <section className="w-full max-w-sm flex flex-col">
              <div className="flex flex-col gap-3 my-4">
                <CardBox className="p-4">Tarjeta de Crédito / Débito</CardBox>
                <CardBox className="p-4">Billetera Digital</CardBox>
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setCurrentStep(2)}>
                  <ArrowLeftIcon />
                  Volver
                </Button>
                <Button onClick={() => setCurrentStep(4)}>
                  Continuar <ChevronRightIcon />
                </Button>
              </div>
            </section>
          </>
        )}

        {currentStep === 4 && (
          <>
            <section className="text-center flex flex-col gap-1">
              <h1 className="font-bold text-xl">Confirmación y pago</h1>
              <p className="max-w-80 text-sm/tight text-muted-foreground ">
                Revisa el resumen para activar el espacio de trabajo.
              </p>
            </section>

            <section className="w-full max-w-sm flex flex-col">
              <CardBox className="flex items-center justify-center text-sm p-6 my-4">
                Div para poner la data privada de la tarjeta
              </CardBox>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setCurrentStep(3)}>
                  <ArrowLeftIcon />
                  Volver
                </Button>
                <Button onClick={() => setCurrentStep('success')}>
                  Pagar <ChevronRightIcon />
                </Button>
              </div>
            </section>
          </>
        )}
      </>
    )
  },
})
