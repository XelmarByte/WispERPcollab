type Permission =
  | '*'
  | 'projects:read'
  | 'projects:create'
  | 'projects:delete'
  | 'billing:read'
  | 'billing:manage'
  | 'members:read'
  | 'members:invite'
  | 'roles:manage'

type Plan = 'starter' | 'pro' | 'enterprise'

type SubscriptionStatus =
  'pending_payment' | 'active' | 'past_due' | 'canceled' | 'unpaid'

type FeatureFlag =
  'electronic_invoicing' | 'inventory_management' | 'audit_logs'

interface PlanConfig {
  name: string
  maxStaffMembers: number
  maxSubscribers: number
  maxRouters: number
  features: Record<FeatureFlag, boolean>
}

export interface OrganizationContext {
  id: string
  name: string
  slug: string
  logoKey: string | null
  displayName: string
  avatarUrl: string | null
  corporateEmail: string
  role: {
    name: string
    permissions: Permission[]
  }
  plan: {
    tier: Plan
    status: SubscriptionStatus
    config: PlanConfig
  }
}

export interface PresignedUrlResponse {
  uploadUrl: string
  fileId: string
}

// GET /account/context
export interface AccountContext {
  id: string
  name: string
  email: string
  imageUrl: string | null
  organizations: OrganizationContext[]
}
