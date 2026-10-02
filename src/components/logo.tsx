import { appName } from '@/lib/config'
import { MousePointerClick } from 'lucide-react'

export function Logo() {
  return (
    <div className="flex gap-1.5 items-center">
      <MousePointerClick />
      <span className="tracking-tighter">{appName}</span>
    </div>
  )
}
