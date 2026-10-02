import { cn } from '@/lib/utils'

export function CardBox({
  className,
  ...props
}: React.ComponentProps<'article'>) {
  return (
    <article
      className={cn(
        'relative rounded-2xl border bg-card not-dark:bg-clip-padding text-card-foreground shadow-xs/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]',
        className,
      )}
      {...props}
    />
  )
}
