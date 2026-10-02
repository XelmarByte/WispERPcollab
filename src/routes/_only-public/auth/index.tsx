import type { OAuthStrategy } from '@clerk/react/types'
import { z } from 'zod'
import { Logo } from '@/components/logo'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useSignIn } from '@clerk/react'
import { emailSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { unknownError } from '@/lib/config'
import { toastManager } from '@/components/ui-utils/toast'
import { Google, Microsoft } from '@/components/icons'
import { useForm, Controller } from 'react-hook-form'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Link, useNavigate, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_only-public/auth/')({
  validateSearch: z.object({ redirect_url: z.string().optional() }),
  component: function RouteComponent() {
    const { redirect_url } = Route.useSearch()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [authStrategy, setAuthStrategy] = useState<OAuthStrategy>()
    const { signIn } = useSignIn()
    const navigate = useNavigate()

    const { control, handleSubmit } = useForm({
      resolver: zodResolver(emailSchema),
      defaultValues: { email: '' },
    })

    const onSubmit = handleSubmit(async (data) => {
      setIsSubmitting(true)

      try {
        await signIn.create({ identifier: data.email, signUpIfMissing: true })
        await signIn.emailCode.sendCode()

        void navigate({
          to: '/auth/verify',
          search: { redirect_url },
          replace: true,
        })
      } catch {
        toastManager.add({
          type: 'error',
          title: unknownError,
        })
        setIsSubmitting(false)
      }
    })

    const signInWith = async (strategy: OAuthStrategy) => {
      setAuthStrategy(strategy)

      try {
        await signIn.sso({
          strategy,
          redirectCallbackUrl: redirect_url
            ? `/auth/callback?redirect_url=${encodeURIComponent(redirect_url)}`
            : '/auth/callback',
          redirectUrl: redirect_url ?? '/', // this is weird idk
        })
      } catch {
        toastManager.add({
          type: 'error',
          title: unknownError,
        })
        setAuthStrategy(undefined)
      }
    }

    return (
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="fixed top-6 left-6">
          <Logo />
        </div>

        <div className="h-full flex items-center justify-center p-6 relative">
          <div className="w-full max-w-84 flex flex-col gap-6">
            <header className="flex flex-col items-center text-center gap-2">
              <h1 className="text-xl font-bold tracking-tight pt-2">
                Inicia sesión o regístrate
              </h1>

              <p className="text-sm text-muted-foreground">
                Elige un método para acceder a tu espacio de trabajo.
              </p>
            </header>

            <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
              <Controller
                name="email"
                control={control}
                render={({
                  field: { name, ref, value, onBlur, onChange },
                  fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                  <Field
                    name={name}
                    dirty={isDirty}
                    invalid={invalid}
                    touched={isTouched}
                    disabled={isSubmitting || !!authStrategy}
                  >
                    <FieldLabel>Correo electrónico</FieldLabel>
                    <Input
                      ref={ref}
                      value={value}
                      onBlur={onBlur}
                      onValueChange={onChange}
                      placeholder="usuario@wisp.com"
                      autoComplete="off"
                      autoCapitalize="none"
                      spellCheck="false"
                      inputMode="email"
                      autoFocus
                    />
                    <FieldError match={!!error}>{error?.message}</FieldError>
                  </Field>
                )}
              />

              <Button
                type="submit"
                loading={isSubmitting}
                disabled={!!authStrategy}
              >
                Acceder
              </Button>

              <div className="contents" id="clerk-captcha" />
            </Form>

            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="grow border-t" />
              <span className="shrink-0">O continúa con</span>
              <div className="grow border-t" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                disabled={
                  isSubmitting ||
                  (authStrategy && authStrategy !== 'oauth_google')
                }
                loading={authStrategy === 'oauth_google'}
                onClick={() => signInWith('oauth_google')}
              >
                <Google aria-hidden="true" />
                <span>Google</span>
              </Button>

              <Button
                variant="outline"
                disabled={
                  isSubmitting ||
                  (authStrategy && authStrategy !== 'oauth_microsoft')
                }
                loading={authStrategy === 'oauth_microsoft'}
                onClick={() => signInWith('oauth_microsoft')}
              >
                <Microsoft aria-hidden="true" />
                <span>Microsoft</span>
              </Button>
            </div>

            <footer className="text-center text-xs text-muted-foreground">
              <span>
                Al acceder aceptas nuestra{' '}
                <Link
                  to="/privacy"
                  className="hover:text-foreground transition-colors underline underline-offset-2"
                >
                  Política de Privacidad
                </Link>{' '}
                y{' '}
                <Link
                  to="/terms"
                  className="hover:text-foreground transition-colors underline underline-offset-2"
                >
                  Términos de Servicio
                </Link>
                .
              </span>
            </footer>
          </div>
        </div>

        <div className="relative hidden bg-muted lg:block">
          <img
            src="https://assets.realmadrid.com/is/image/realmadrid/ND-DIOMANDE-GettyImages-2280553846?wid=1200&hei=675"
            alt="Image"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    )
  },
})
