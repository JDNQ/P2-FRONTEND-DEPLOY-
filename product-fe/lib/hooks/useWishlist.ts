import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { wishlistApi } from '@/lib/api/wishlistApi'
import { toast } from 'sonner'

export function useWishlist() {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const { data } = await wishlistApi.getAll()
      return data.data
    },
  })
}

export function useAddToWishlist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (productId: number) => wishlistApi.add(productId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wishlist'] })
      toast.success('Đã thêm vào danh sách yêu thích')
    },
    onError: () => toast.error('Thêm thất bại'),
  })
}

export function useRemoveFromWishlist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => wishlistApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wishlist'] })
      toast.success('Đã xóa khỏi danh sách yêu thích')
    },
    onError: () => toast.error('Xóa thất bại'),
  })
}

export function useAddAllWishlistToCart() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => wishlistApi.addAllToCart(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wishlist'] })
      qc.invalidateQueries({ queryKey: ['cart'] })
      toast.success('Đã thêm tất cả vào giỏ hàng')
    },
    onError: () => toast.error('Thêm vào giỏ hàng thất bại'),
  })
}
