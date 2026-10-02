import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/_personal/organizations/join',
)({
  component: function RouteComponent() {
    return <div>Hello "/_authenticated/_personal/organizations/join"!</div>
  },
})
