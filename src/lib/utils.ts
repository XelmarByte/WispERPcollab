import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { unknownError } from './config'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const getErrorMessage = (err: unknown) => {
  if (err instanceof Error) {
    return err.message
  }
  return unknownError
}

export const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ñ/g, 'n')
    .replace(/ü/g, 'u')
    .replace(/&/g, 'y')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
