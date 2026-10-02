import { Outlet, redirect, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_only-public')({
  beforeLoad: ({ context }) => {
    if (context.isSignedIn) {
      throw redirect({ to: '/' })
    }
  },
  component: () => <Outlet />,
})
