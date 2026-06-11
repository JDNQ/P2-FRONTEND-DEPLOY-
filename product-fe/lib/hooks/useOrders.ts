import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@/lib/api/orderApi";
import { useAuthStore } from "@/lib/stores/authStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useMyOrders() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ["orders", "my"],
    queryFn: async () => {
      const { data } = await orderApi.getMy();
      return data.data;
    },
    enabled: isAuthenticated,
  });
}

export function useAllOrders() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ["orders", "all"],
    queryFn: async () => {
      const { data } = await orderApi.getAll();
      return data.data;
    },
    enabled: isAuthenticated,
  });
}

export function useCreateOrder() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: orderApi.create,
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      const orderId = res.data.data.id;
      router.push(`/checkout/success?orderId=${orderId}`);
    },
    onError: (err: any) =>
      toast.error(
        err?.response?.data?.message || "Đặt hàng thất bại, vui lòng thử lại",
      ),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      orderApi.updateStatus(id, { status: status as any }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Cập nhật trạng thái thành công");
    },
    onError: () => toast.error("Cập nhật thất bại"),
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => orderApi.cancelByUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Đã hủy đơn hàng");
    },
    onError: () => toast.error("Hủy đơn hàng thất bại"),
  });
}
