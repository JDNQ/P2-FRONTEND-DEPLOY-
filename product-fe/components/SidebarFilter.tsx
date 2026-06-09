'use client'

interface SidebarFilterProps {
  minPrice: number
  maxPrice: number
  rangeValue: number
  onMinPriceChange: (v: number) => void
  onMaxPriceChange: (v: number) => void
  onRangeValueChange: (v: number) => void
  onClearAll: () => void
}

export default function SidebarFilter({
  minPrice,
  maxPrice,
  rangeValue,
  onMinPriceChange,
  onMaxPriceChange,
  onRangeValueChange,
  onClearAll,
}: SidebarFilterProps) {
  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="bg-surface-container-low p-stack-md rounded-xl shadow-sm sticky top-24">
        <div className="flex items-center justify-between mb-stack-md">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Bộ lọc</h2>
          <button onClick={onClearAll} className="text-primary font-label-md text-label-md hover:underline">
            Xóa tất cả
          </button>
        </div>
        <div className="mb-stack-lg">
          <h3 className="font-label-md text-label-md font-bold text-on-surface mb-stack-sm">Khoảng giá</h3>
          <div className="space-y-3">
            <input
              type="range" min="0" max="50"
              value={rangeValue}
              onChange={(e) => { onRangeValueChange(Number(e.target.value)); onMaxPriceChange(Number(e.target.value) * 1000000) }}
              className="w-full accent-primary"
            />
            <div className="flex items-center gap-2">
              <input
                className="w-1/2 rounded-lg border-outline-variant bg-surface text-label-md py-1 px-2 outline-none"
                placeholder="Từ" type="text"
                value={minPrice > 0 ? minPrice.toLocaleString() : ''}
                onChange={(e) => onMinPriceChange(Number(e.target.value.replace(/\D/g, '')) || 0)}
              />
              <input
                className="w-1/2 rounded-lg border-outline-variant bg-surface text-label-md py-1 px-2 outline-none"
                placeholder="Đến" type="text"
                value={maxPrice < Infinity ? maxPrice.toLocaleString() : ''}
                onChange={(e) => onMaxPriceChange(Number(e.target.value.replace(/\D/g, '')) || Infinity)}
              />
            </div>
            <button
              onClick={() => { onMinPriceChange(minPrice); onMaxPriceChange(maxPrice) }}
              className="w-full bg-primary-container text-on-primary font-label-md py-2 rounded-lg hover:brightness-110 transition-all"
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
