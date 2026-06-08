import { create } from 'zustand'
import type { Product } from '@/lib/types/product'
import { toast } from 'sonner'

interface CompareStore {
  products: Product[]
  add: (p: Product) => void
  remove: (id: number) => void
  clear: () => void
  isInCompare: (id: number) => boolean
}

export const useCompareStore = create<CompareStore>((set, get) => ({
  products: [],
  add: (p) => {
    if (get().products.length >= 3) {
      toast.error('Chỉ so sánh tối đa 3 sản phẩm')
      return
    }
    if (get().isInCompare(p.id)) return
    set((s) => ({ products: [...s.products, p] }))
  },
  remove: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
  clear: () => set({ products: [] }),
  isInCompare: (id) => get().products.some((p) => p.id === id),
}))
