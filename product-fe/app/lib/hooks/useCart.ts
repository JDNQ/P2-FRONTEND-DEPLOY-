import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cartApi } from '@/lib/api/cartApi'
import { useCartStore } from '@/lib/stores/cartStore'
import { toast } from 'sonner'

export const CART_KEY = ['cart']

export function useCart() {
  const setCount = useCartStore((s) => s.setCount)
  return useQuery({
    queryKey: CART_KEY,
    queryFn: async () => {
      const { data } = await cartApi.get()
      const total = data.data.items.reduce((sum, i) => sum + i.quantity, 0)
      setCount(total)
      return data.data
    },
  })
}

export function useAddToCart() {
  const qc = useQueryClient()
  const increment = useCartStore((s) => s.increment)
  return useMutation({
    mutationFn: cartApi.add,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CART_KEY })
      increment()
      toast.success('Đã thêm vào giỏ hàng!')
    },
    onError: () => toast.error('Không thể thêm vào giỏ'),
  })
}

export function useUpdateCartItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      cartApi.update(id, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
    onError: () => toast.error('Cập nhật thất bại'),
  })
}

export function useRemoveCartItem() {
  const qc = useQueryClient()
  const decrement = useCartStore((s) => s.decrement)
  return useMutation({
    mutationFn: cartApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CART_KEY })
      decrement()
    },
    onError: () => toast.error('Xóa thất bại'),
  })
}

export function useClearCart() {
  const qc = useQueryClient()
  const reset = useCartStore((s) => s.reset)
  return useMutation({
    mutationFn: cartApi.clear,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CART_KEY })
      reset()
    },
  })
}
