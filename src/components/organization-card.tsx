// import type { OrganizationContext } from '@/types/api'
import { Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { CardBox } from '@/components/card-box'
import { ChevronRightIcon } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

export function OrganizationCard() {
  return (
    <Link to="/organizations/new" className="rounded-2xl">
      <CardBox className="p-3 flex gap-3 items-center group hover:bg-accent/70">
        <Avatar className="rounded-lg size-9">
          <AvatarImage alt="" src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[15px]">Acme Studio</span>
            <Badge variant="secondary">Propietario</Badge>
          </div>
          <span className="text-sm text-muted-foreground">
            acme-studio.app.com
          </span>
        </div>

        <div>
          <ChevronRightIcon className="size-4 text-foreground opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </div>
      </CardBox>
    </Link>
  )
}
