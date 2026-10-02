import { router } from './router'
import { useAuth } from '@clerk/react'
import { Spinner } from '@/components/ui/spinner'
import { useEffect } from 'react'
import { setTokenGetter } from '@/lib/axios'
import { RouterProvider } from '@tanstack/react-router'

export function InnerApp() {
  const { userId, getToken } = useAuth()

  useEffect(() => {
    setTokenGetter(async () => {
      return await getToken()
    })
  }, [getToken])

  if (userId === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  return (
    <RouterProvider router={router} context={{ isSignedIn: userId !== null }} />
  )
}
