import { z } from 'zod'

export const emailSchema = z.object({
  email: z.email({
    error: (issue) =>
      issue.input === undefined || issue.input === ''
        ? 'El correo es requerido'
        : 'Correo no válido',
  }),
})
