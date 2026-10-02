import { z } from 'zod'
import { Spinner } from '@/components/ui/spinner'
import { unknownError } from '@/lib/config'
import { toastManager } from '@/components/ui-utils/toast'
import { useRef, useEffect } from 'react'
import { useNavigate, createFileRoute } from '@tanstack/react-router'
import { useClerk, useSignIn, useSignUp } from '@clerk/react'

export const Route = createFileRoute('/_only-public/auth/callback')({
  validateSearch: z.object({ redirect_url: z.string().optional() }),
  component: function RouteComponent() {
    const { redirect_url } = Route.useSearch()

    const { loaded } = useClerk()
    const { signIn } = useSignIn()
    const { signUp } = useSignUp()
    const hasRun = useRef(false)
    const navigate = useNavigate()

    const finalizeSignIn = async () => {
      await signIn.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl(redirect_url ?? '/')
          window.location.href = url
        },
      })
    }

    const finalizeSignUp = async () => {
      await signUp.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl(redirect_url ?? '/')
          window.location.href = url
        },
      })
    }

    // App only use signIn.sso()
    useEffect(() => {
      void (async () => {
        if (!loaded || hasRun.current) return
        hasRun.current = true

        try {
          // sign-in -> sign-in
          if (signIn.status === 'complete') {
            await finalizeSignIn()
            return
          }

          // sign-in -> sign-up
          if (signIn.isTransferable) {
            await signUp.create({ transfer: true })
            if (signUp.status === 'complete') {
              await finalizeSignUp()
              return
            }
          }
          // 2 more cases if signUp.sso() is used
        } catch {
          toastManager.add({
            type: 'error',
            title: unknownError,
          })
          void navigate({ to: '/auth', replace: true })
        }
      })()

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signIn, signUp, loaded])

    return (
      <div className="min-h-svh grid place-content-center">
        <div className="text-center relative">
          <p className="font-medium">Iniciando sesión...</p>
          <p className="text-sm text-muted-foreground">
            Un momento, por favor.
          </p>
          <div className="absolute top-full w-full mt-4 h-17 grid place-content-center">
            <Spinner className="size-6 mx-auto" />
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4">
            <div id="clerk-captcha" />
          </div>
        </div>
      </div>
    )
  },
})
