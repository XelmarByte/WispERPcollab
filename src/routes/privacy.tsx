import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy')({
  component: function RouteComponent() {
    return <div>Hello "/privacy"!</div>
  },
})
