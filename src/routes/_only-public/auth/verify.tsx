import { z } from 'zod'
import { Logo } from '@/components/logo'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { toastManager } from '@/components/ui-utils/toast'
import { getErrorMessage } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'
import { Field, FieldLabel } from '@/components/ui/field'
import { useState, useEffect } from 'react'
import { useSignIn, useSignUp } from '@clerk/react'
import { authResendCodeCooldown } from '@/lib/config'
import { isClerkAPIResponseError } from '@clerk/react/errors'
import { OTPField, OTPFieldInput } from '@/components/ui/otp-field'

export const Route = createFileRoute('/_only-public/auth/verify')({
  validateSearch: z.object({ redirect_url: z.string().optional() }),
  component: function RouteComponent() {
    const { redirect_url } = Route.useSearch()

    const [code, setCode] = useState('')
    const [cooldown, setCooldown] = useState(0)
    const [isResending, setIsResending] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { signIn } = useSignIn()
    const { signUp } = useSignUp()

    useEffect(() => {
      if (cooldown <= 0) return
      const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000)
      return () => clearTimeout(timer)
    }, [cooldown])

    const handleSubmit = async (ev: React.SubmitEvent<HTMLFormElement>) => {
      ev.preventDefault()
      if (isSubmitting || isResending) return
      setIsSubmitting(true)

      try {
        const { error: signInError } = await signIn.emailCode.verifyCode({
          code,
        })

        if (signInError) {
          if (isClerkAPIResponseError(signInError)) {
            if (signInError.errors[0]?.code === 'sign_up_if_missing_transfer') {
              await signUp.create({ transfer: true })

              if (signUp.status === 'complete') {
                await signUp.finalize({
                  navigate: ({ decorateUrl }) => {
                    const url = decorateUrl(redirect_url ?? '/')
                    window.location.href = url
                  },
                })
                return
              } else {
                throw ''
              }
            }

            if (signInError.errors[0]?.code === 'form_code_incorrect')
              throw new Error('Código incorrecto. Vuelve a intentarlo.')

            if (signInError.errors[0]?.code === 'verification_expired')
              throw new Error('El código ha expirado. Solicita uno nuevo.')

            throw ''
          } else {
            throw ''
          }
        }

        if (signIn.status === 'complete') {
          await signIn.finalize({
            navigate: ({ decorateUrl }) => {
              const url = decorateUrl(redirect_url ?? '/')
              window.location.href = url
            },
          })
        } else {
          throw ''
        }
      } catch (e) {
        toastManager.add({
          type: 'error',
          title: getErrorMessage(e),
        })
        setIsSubmitting(false)
      }
    }

    const handleResend = async () => {
      if (cooldown > 0 || isSubmitting || isResending) return
      setIsResending(true)
      setCode('')

      try {
        await signIn.emailCode.sendCode()
        setCooldown(authResendCodeCooldown)
      } catch {
        toastManager.add({
          type: 'error',
          title: 'No se pudo reenviar un nuevo código. Inténtalo de nuevo.',
        })
      } finally {
        setIsResending(false)
      }
    }

    return (
      <div className="min-h-svh flex items-center justify-center p-6 relative">
        <div className="w-full max-w-84 flex flex-col gap-6">
          <header className="flex flex-col items-center text-center gap-2">
            <Logo />

            <h1 className="text-xl font-bold tracking-tight pt-2">
              Verifica tu correo
            </h1>

            <div className="text-sm text-muted-foreground flex flex-col">
              <p>Enviamos un código de 6 dígitos a</p>
              <span className="wrap-anywhere line-clamp-1 font-semibold">
                {signIn.identifier ?? 'tu correo'}
              </span>
            </div>
          </header>

          <div className="flex flex-col gap-6">
            <Form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 justify-center items-center"
            >
              <Field name="code" disabled={isSubmitting || isResending}>
                <FieldLabel className="sr-only">
                  Código de verificación
                </FieldLabel>
                <OTPField
                  aria-label="Código de verificación"
                  length={6}
                  required
                  onValueChange={setCode}
                  value={code}
                >
                  <OTPFieldInput autoFocus />
                  <OTPFieldInput aria-label="Carácter 2 de 6" />
                  <OTPFieldInput aria-label="Carácter 3 de 6" />
                  <OTPFieldInput aria-label="Carácter 4 de 6" />
                  <OTPFieldInput aria-label="Carácter 5 de 6" />
                  <OTPFieldInput aria-label="Carácter 6 de 6" />
                </OTPField>
              </Field>

              <Button
                type="submit"
                className="w-4/5"
                disabled={isResending || isSubmitting}
                loading={isSubmitting}
              >
                Verificar
              </Button>
            </Form>
          </div>

          <footer className="flex text-sm gap-2 justify-center p-4 border-t">
            <span className="text-muted-foreground">
              No recibiste ningún código?
            </span>

            <button
              type="button"
              disabled={isResending || isSubmitting || cooldown > 0}
              className="hover:underline underline-offset-2 disabled:opacity-50 disabled:pointer-events-none"
              onClick={handleResend}
            >
              {isResending
                ? 'Reenviando...'
                : cooldown > 0
                  ? `Reenviar (${cooldown}s)`
                  : 'Reenviar'}
            </button>
          </footer>
        </div>
      </div>
    )
  },
})
