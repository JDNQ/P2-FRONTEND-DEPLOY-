import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationApi } from '@/lib/api/notificationApi'
import { toast } from 'sonner'

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await notificationApi.getAll()
      return data.data
    },
  })
}

export function useMarkNotificationRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => notificationApi.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => notificationApi.markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
    onError: () => toast.error('Không thể đánh dấu tất cả'),
  })
}

export function useDeleteNotification() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => notificationApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
    onError: () => toast.error('Xóa thông báo thất bại'),
  })
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const { data } = await notificationApi.getUnreadCount()
      return data.data
    },
  })
}
