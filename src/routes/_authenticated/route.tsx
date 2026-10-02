import { accountContextOptions } from '@/lib/queries'
import { Outlet, redirect, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    if (!context.isSignedIn) {
      const isRoot = location.pathname === '/'
      throw redirect({
        to: '/auth',
        search: isRoot ? undefined : { redirect_url: location.href },
      })
    }
  },
  loader: ({ context: { queryClient } }) => {
    return queryClient.query({ ...accountContextOptions, staleTime: 'static' })
  },
  component: () => <Outlet />,
})
