import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/terms')({
  component: function RouteComponent() {
    return <div>Hello "/terms"!</div>
  },
})
