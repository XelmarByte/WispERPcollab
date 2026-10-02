import { cn } from '@/lib/utils'

export function Microsoft({ className, ...rest }: React.ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 640 640"
      fill="currentColor"
      className={cn('size-4', className)}
      {...rest}
    >
      <path d="M96 96L310.6 96L310.6 310.6L96 310.6L96 96zM329.4 96L544 96L544 310.6L329.4 310.6L329.4 96zM96 329.4L310.6 329.4L310.6 544L96 544L96 329.4zM329.4 329.4L544 329.4L544 544L329.4 544L329.4 329.4z" />
    </svg>
  )
}

export function Google({ className, ...rest }: React.ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 640 640"
      fill="currentColor"
      className={cn('size-4', className)}
      {...rest}
    >
      <path d="M564 325.8C564 467.3 467.1 568 324 568C186.8 568 76 457.2 76 320C76 182.8 186.8 72 324 72C390.8 72 447 96.5 490.3 136.9L422.8 201.8C334.5 116.6 170.3 180.6 170.3 320C170.3 406.5 239.4 476.6 324 476.6C422.2 476.6 459 406.2 464.8 369.7L324 369.7L324 284.4L560.1 284.4C562.4 297.1 564 309.3 564 325.8z" />
    </svg>
  )
}
