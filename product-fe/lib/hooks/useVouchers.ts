import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { voucherApi } from '@/lib/api/voucherApi'
import { toast } from 'sonner'
import type { CreateVoucherDto } from '@/lib/types/voucher'

export function useVouchers() {
  return useQuery({
    queryKey: ['vouchers'],
    queryFn: async () => {
      const { data } = await voucherApi.getAll()
      return data.data
    },
  })
}

export function useCreateVoucher() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateVoucherDto) => voucherApi.create(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vouchers'] })
      toast.success('Tạo voucher thành công')
    },
    onError: () => toast.error('Tạo voucher thất bại'),
  })
}

export function useDeactivateVoucher() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => voucherApi.deactivate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vouchers'] })
      toast.success('Voucher đã được hủy kích hoạt')
    },
    onError: () => toast.error('Hủy kích hoạt thất bại'),
  })
}
