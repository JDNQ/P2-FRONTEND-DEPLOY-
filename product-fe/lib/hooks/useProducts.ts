import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productApi } from '@/lib/api/productApi'
import { toast } from 'sonner'

export const productKeys = {
  all: ['products'] as const,
  one: (id: number) => ['products', id] as const,
}

export function useProducts() {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: async () => {
      const { data } = await productApi.getAll()
      return data.data
    },
  })
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: productKeys.one(id),
    queryFn: async () => {
      const { data } = await productApi.getOne(id)
      return data.data
    },
    enabled: !!id,
  })
}

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all })
      toast.success('Tạo sản phẩm thành công!')
    },
    onError: () => toast.error('Tạo sản phẩm thất bại'),
  })
}

export function useUpdateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => productApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: productKeys.all })
      qc.invalidateQueries({ queryKey: productKeys.one(id) })
      toast.success('Cập nhật thành công!')
    },
    onError: () => toast.error('Cập nhật thất bại'),
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all })
      toast.success('Đã xóa sản phẩm')
    },
    onError: () => toast.error('Xóa thất bại'),
  })
}
