import { routeTree } from './routeTree.gen'
import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'

export const queryClient = new QueryClient()

export const router = createRouter({
  routeTree,
  context: { isSignedIn: undefined!, queryClient },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
})
