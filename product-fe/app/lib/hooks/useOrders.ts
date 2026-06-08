import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderApi } from '@/lib/api/orderApi'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function useMyOrders() {
  return useQuery({
    queryKey: ['orders', 'my'],
    queryFn: async () => {
      const { data } = await orderApi.getMy()
      return data.data
    },
  })
}

export function useAllOrders() {
  return useQuery({
    queryKey: ['orders', 'all'],
    queryFn: async () => {
      const { data } = await orderApi.getAll()
      return data.data
    },
  })
}

export function useCreateOrder() {
  const router = useRouter()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: orderApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] })
      qc.invalidateQueries({ queryKey: ['orders'] })
      router.push('/checkout/success')
    },
    onError: () => toast.error('Đặt hàng thất bại, vui lòng thử lại'),
  })
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      orderApi.updateStatus(id, { status: status as any }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Cập nhật trạng thái thành công')
    },
    onError: () => toast.error('Cập nhật thất bại'),
  })
}
