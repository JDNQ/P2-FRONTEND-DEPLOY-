import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { userApi } from '@/lib/api/userApi'
import type { DashboardStats, UserProfile } from '@/lib/types/user'
import { toast } from 'sonner'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await userApi.getAll()
      return data.data
    },
  })
}

function computeUserStats(users: UserProfile[]): DashboardStats {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  return {
    totalUsers: users.length,
    activeNow: users.filter((u) => u.status === 'Active').length,
    newThisWeek: users.filter((u) => new Date(u.createdAt).getTime() >= weekAgo).length,
    banned: users.filter((u) => u.status === 'Banned').length,
    totalUsersTrend: 0,
  }
}

/** Tính stats từ danh sách users — BE không có endpoint /users/stats */
export function useUserStats() {
  const { data: users = [], isLoading } = useUsers()
  const stats = useMemo(
    () => (users.length > 0 ? computeUserStats(users) : null),
    [users],
  )
  return { data: stats, isLoading }
}

export function useUpdateUserRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) =>
      userApi.updateRole(id, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('Cập nhật role thành công')
    },
    onError: () => toast.error('Cập nhật thất bại'),
  })
}

export function useToggleUserStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => userApi.toggleStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('Cập nhật trạng thái thành công')
    },
    onError: () => toast.error('Cập nhật thất bại'),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => userApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('Xóa người dùng thành công')
    },
    onError: () => toast.error('Xóa thất bại'),
  })
}
