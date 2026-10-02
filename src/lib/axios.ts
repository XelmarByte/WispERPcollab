import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: { 'Content-Type': 'application/json' },
})

type TokenGetterFn = () => Promise<string | null>
let getTokenFn: TokenGetterFn | null = null

export const setTokenGetter = (fn: TokenGetterFn) => {
  getTokenFn = fn
}

api.interceptors.request.use(async (config) => {
  if (getTokenFn) {
    const token = await getTokenFn()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})
