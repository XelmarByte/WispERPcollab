import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSuspenseQuery } from '@tanstack/react-query'
import { OrganizationCard } from '@/components/organization-card'
import { accountContextOptions } from '@/lib/queries'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  PlusIcon,
  KeyRoundIcon,
  ArrowRightIcon,
  ChevronRightIcon,
} from 'lucide-react'

export const Route = createFileRoute('/_authenticated/_personal/')({
  component: function RouteComponent() {
    const { data } = useSuspenseQuery(accountContextOptions)

    return (
      <>
        <Avatar className="size-16 ring-background ring-3 shadow-lg mb-4">
          <AvatarImage alt={data.name} src={data.imageUrl ?? ''} />
          <AvatarFallback>{data.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        <section className="text-center flex flex-col gap-1">
          <h1 className="font-bold text-xl">Hola, {data.name.split(' ')[0]}</h1>
          <p className="max-w-80 text-sm/tight text-muted-foreground ">
            {data.organizations.length === 0
              ? 'No tienes organizaciones asociadas. Crea una o únete a tu equipo para continuar.'
              : 'Elige la organización a la que deseas acceder.'}
          </p>
        </section>

        <div className="w-full max-w-sm mt-7">
          {data.organizations.length === 0 ? (
            <div className="flex flex-col gap-2.5">
              <Button
                render={<Link to="/organizations/new" />}
                className="rounded-2xl h-12 sm:h-12 px-4"
              >
                <PlusIcon />
                <span className="flex-1 text-start">
                  Crear un nuevo workspace
                </span>
                <ArrowRightIcon />
              </Button>
              <Button
                render={<Link to="/organizations/join" />}
                variant="outline"
                className="rounded-2xl h-12 sm:h-12 px-4"
              >
                <KeyRoundIcon />
                <span className="flex-1 text-start">
                  Unirse con un código de invitación
                </span>
                <ChevronRightIcon />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col">
              <ScrollArea className="max-h-fit h-[33svh]" scrollFade>
                <div className="flex flex-col gap-3 ">
                  {Array.from({ length: 1 }).map((_, i) => (
                    <OrganizationCard key={i} />
                  ))}
                </div>
              </ScrollArea>

              <Separator className="mt-3 mb-4" />

              <div className="flex justify-between text-sm font-medium">
                <Link
                  to="/organizations/new"
                  className="flex gap-1 items-center opacity-80 hover:opacity-100"
                >
                  <PlusIcon className="size-4" aria-hidden="true" /> Nuevo
                  workspace
                </Link>
                <Link
                  to="/organizations/join"
                  className="opacity-50 hover:opacity-100"
                >
                  Unirse con código
                </Link>
              </div>
            </div>
          )}
        </div>
      </>
    )
  },
})
