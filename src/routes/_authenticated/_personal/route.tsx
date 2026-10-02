import { Logo } from '@/components/logo'
import { useClerk } from '@clerk/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { accountContextOptions } from '@/lib/queries'
import { LogOutIcon, Settings2Icon } from 'lucide-react'
import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuTrigger,
  MenuSeparator,
} from '@/components/ui/menu'

export const Route = createFileRoute('/_authenticated/_personal')({
  component: function RouteComponent() {
    const { data } = useSuspenseQuery(accountContextOptions)
    const { signOut } = useClerk()

    return (
      <div className="min-h-svh flex flex-col items-center justify-center p-6">
        <Link to="/" className="fixed top-4 left-4">
          <Logo />
        </Link>

        <Menu>
          <MenuTrigger className="fixed top-4 right-4 rounded-full">
            <Avatar>
              <AvatarImage alt={data.name} src={data.imageUrl ?? ''} />
              <AvatarFallback>
                {data.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </MenuTrigger>
          <MenuPopup align="end" className="w-56">
            <div className="flex flex-col px-2 py-1">
              <span className="font-bold truncate text-sm">{data.name}</span>
              <span className="text-muted-foreground truncate text-[13px]">
                {data.email}
              </span>
            </div>
            <MenuSeparator />
            <MenuItem render={<Link to="/organizations/new" />}>
              <Settings2Icon />
              Ajustes de cuenta
            </MenuItem>
            <MenuItem
              variant="destructive"
              onClick={() => signOut({ redirectUrl: '/auth' })}
            >
              <LogOutIcon />
              Cerrar sesión
            </MenuItem>
          </MenuPopup>
        </Menu>

        <Outlet />
      </div>
    )
  },
})
