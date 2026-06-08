import { useAuthStore } from '@/lib/stores/authStore'

export function usePermission() {
  const { user, isAuthenticated } = useAuthStore()
  const role = user?.role

  return {
    role,
    isAuthenticated,
    isUser: role === 'USER',
    isAdmin: role === 'ADMIN' || role === 'MANAGER',
    isManager: role === 'MANAGER',
    canManageProducts: role === 'ADMIN' || role === 'MANAGER',
    canManageOrders: role === 'ADMIN' || role === 'MANAGER',
    canManageVouchers: role === 'ADMIN' || role === 'MANAGER',
    canManageUsers: role === 'MANAGER',
    canCreateManager: role === 'ADMIN' || role === 'MANAGER',
    canDeleteProducts: role === 'MANAGER',
    canViewRevenue: role === 'MANAGER',
  }
}
