import type { AccountContext } from '@/types/api'
import { api } from './axios'
import { queryOptions } from '@tanstack/react-query'

export const accountContextOptions = queryOptions({
  queryKey: ['account-context'],
  queryFn: async () => {
    const { data } = await api.get<AccountContext>('/account/context')
    return data
  },
  refetchOnWindowFocus: false,
  staleTime: Infinity,
})
