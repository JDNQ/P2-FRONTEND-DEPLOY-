'use client'
import { useQuery } from '@tanstack/react-query'
import { orderApi } from '@/lib/api/orderApi'
import { formatPrice } from '@/lib/utils/formatPrice'
import { formatDate } from '@/lib/utils/formatDate'
import { PLACEHOLDER_80 } from '@/lib/utils/placeholder'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: string }> = {
  PENDING:   { label: 'Chờ xác nhận', bg: 'bg-yellow-100', text: 'text-yellow-700', icon: 'schedule' },
  CONFIRMED: { label: 'Đã xác nhận', bg: 'bg-blue-100', text: 'text-blue-700', icon: 'check_circle' },
  SHIPPING:  { label: 'Đang giao', bg: 'bg-purple-100', text: 'text-purple-700', icon: 'local_shipping' },
  DELIVERED: { label: 'Đã giao', bg: 'bg-green-100', text: 'text-green-700', icon: 'check_circle' },
  CANCELLED: { label: 'Đã hủy', bg: 'bg-red-100', text: 'text-red-700', icon: 'cancel' },
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading } = useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const { data } = await orderApi.getOne(Number(id))
      return data.data
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-container-max mx-auto px-gutter py-stack-lg animate-pulse">
          <div className="h-8 bg-surface-container-high rounded w-1/3 mb-stack-lg" />
          <div className="h-48 bg-surface-container-high rounded-xl mb-stack-lg" />
          <div className="h-64 bg-surface-container-high rounded-xl" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background text-on-surface">
        <Header />
        <div className="max-w-container-max mx-auto px-gutter py-stack-lg text-center">
          <span className="material-symbols-outlined text-[80px] text-outline-variant mb-stack-md">package</span>
          <h2 className="font-heading text-headline-sm text-on-surface mb-1">Không tìm thấy đơn hàng</h2>
          <Link href="/orders" className="text-primary hover:underline">Quay lại đơn hàng</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING

  return (
    <div className="min-h-screen bg-background text-on-surface pb-20 md:pb-0">
      <Header />
      <div className="max-w-container-max mx-auto px-gutter py-stack-lg">
        <nav className="flex items-center gap-2 mb-stack-lg font-caption text-caption text-on-surface-variant">
          <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <Link href="/orders" className="hover:text-primary transition-colors">Đơn hàng</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="font-bold text-on-surface">#{order.id}</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-stack-lg">
          <h1 className="font-heading text-display-lg-mobile md:text-display-lg text-on-surface">Đơn hàng #{order.id}</h1>
          <span className={`px-4 py-2 rounded-full font-label-md flex items-center gap-2 w-fit ${cfg.bg} ${cfg.text}`}>
            <span className="material-symbols-outlined text-[18px]">{cfg.icon}</span>
            {cfg.label}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
          <div className="lg:col-span-2 space-y-stack-lg">
            <section className="bg-white rounded-xl p-stack-lg shadow-sm border border-neutral-50">
              <h2 className="font-heading text-headline-sm text-on-surface mb-stack-lg">Sản phẩm</h2>
              <div className="space-y-stack-md">
                {order.items.map((item, idx) => {
                  const itemPrice = item.price || 0
                  return (
                    <div key={item.id || idx} className="flex gap-4 pb-stack-md border-b border-outline-variant last:border-0 last:pb-0">
                      <div className="relative w-20 h-20 bg-surface rounded-xl overflow-hidden flex-shrink-0 border border-outline-variant">
                        {item.product?.images?.[0]?.url ? (
                          <img src={item.product.images[0].url} alt={item.product.productName}
                            className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_80 }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-outline">
                            <span className="material-symbols-outlined text-2xl">image</span>
                          </div>
                        )}
                        <span className="absolute top-1 right-1 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold bg-on-surface">{item.quantity}</span>
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-label-md text-label-md text-on-surface">{item.product?.productName || 'Product'}</h3>
                        <p className="font-caption text-caption text-on-surface-variant">{item.variant?.variantName || ''}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-price-display text-price-display text-primary">{formatPrice(itemPrice * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>

          <aside className="space-y-stack-lg">
            <section className="bg-white rounded-xl p-stack-lg shadow-sm border border-neutral-50">
              <h2 className="font-heading text-headline-sm text-on-surface mb-stack-lg">Thông tin đơn hàng</h2>
              <div className="space-y-stack-md">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Ngày đặt</span>
                  <span className="font-medium">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Tạm tính</span>
                  <span>{formatPrice(order.totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Phí vận chuyển</span>
                  <span className="text-primary">Miễn phí</span>
                </div>
                {order.voucherCode && (
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Mã giảm giá</span>
                    <span className="text-primary">{order.voucherCode}</span>
                  </div>
                )}
                <div className="flex justify-between pt-stack-md border-t border-outline-variant">
                  <span className="font-heading text-headline-sm text-on-surface">Tổng cộng</span>
                  <span className="font-price-display text-price-display text-primary">{formatPrice(order.totalPrice)}</span>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl p-stack-lg shadow-sm border border-neutral-50">
              <h2 className="font-heading text-headline-sm text-on-surface mb-stack-lg">Thông tin giao hàng</h2>
              <div className="space-y-stack-md">
                {order.shippingAddress && (
                  <div>
                    <span className="text-caption text-on-surface-variant block">Địa chỉ</span>
                    <span className="font-medium">{order.shippingAddress}</span>
                  </div>
                )}
                {order.phoneNumber && (
                  <div>
                    <span className="text-caption text-on-surface-variant block">Số điện thoại</span>
                    <span className="font-medium">{order.phoneNumber}</span>
                  </div>
                )}
                {order.note && (
                  <div>
                    <span className="text-caption text-on-surface-variant block">Ghi chú</span>
                    <span className="font-medium">{order.note}</span>
                  </div>
                )}
              </div>
            </section>

            <Link href="/orders" className="flex items-center gap-2 text-primary hover:underline font-label-md">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Quay lại đơn hàng
            </Link>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  )
}
