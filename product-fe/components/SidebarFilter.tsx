'use client'

interface SidebarFilterProps {
  minPrice: number
  maxPrice: number
  rangeValue: number
  selectedBrands: string[]
  onMinPriceChange: (v: number) => void
  onMaxPriceChange: (v: number) => void
  onRangeValueChange: (v: number) => void
  onSelectedBrandsChange: (v: string[]) => void
  onClearAll: () => void
}

const BRANDS = ['Apple', 'Samsung', 'Sony', 'Xiaomi', 'Dell', 'Logitech']

export default function SidebarFilter({
  minPrice,
  maxPrice,
  rangeValue,
  selectedBrands,
  onMinPriceChange,
  onMaxPriceChange,
  onRangeValueChange,
  onSelectedBrandsChange,
  onClearAll,
}: SidebarFilterProps) {
  const toggleBrand = (brand: string) => {
    onSelectedBrandsChange(
      selectedBrands.includes(brand)
        ? selectedBrands.filter((b) => b !== brand)
        : [...selectedBrands, brand],
    )
  }

  const handleMaxPriceInput = (value: string) => {
    const num = Number(value.replace(/\D/g, '')) || 0
    onMaxPriceChange(num > 0 ? num : Infinity)
    if (num > 0) {
      const newRange = Math.min(Math.round(num / 1000000), 50)
      onRangeValueChange(newRange)
    } else {
      onRangeValueChange(50)
    }
  }

  const handleRangeSlider = (value: number) => {
    onRangeValueChange(value)
    const price = value * 1000000
    onMaxPriceChange(price > 0 ? price : Infinity)
  }

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="bg-surface border border-outline-variant/30 p-stack-md rounded-2xl shadow-sm sticky top-24 space-y-6">
        {/* Title */}
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">filter_list</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Bộ lọc</h2>
          </div>
          <button
            onClick={onClearAll}
            className="text-primary font-label-md text-label-md hover:underline font-semibold"
          >
            Xóa tất cả
          </button>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="font-label-md text-label-md font-bold text-on-surface mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">payments</span>
            Khoảng giá (VND)
          </h3>
          <div className="space-y-4">
            <input
              type="range"
              min="0"
              max="50"
              value={maxPrice < Infinity ? Math.min(Math.round(maxPrice / 1000000), 50) : rangeValue}
              onChange={(e) => handleRangeSlider(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex items-center gap-2">
              <div className="relative w-1/2">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-caption text-caption text-on-surface-variant">Từ</span>
                <input
                  className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md py-2 pl-7 pr-2 outline-none focus:border-primary transition-all font-semibold"
                  placeholder="0"
                  type="text"
                  value={minPrice > 0 ? minPrice.toLocaleString() : ''}
                  onChange={(e) => onMinPriceChange(Number(e.target.value.replace(/\D/g, '')) || 0)}
                />
              </div>
              <div className="relative w-1/2">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-caption text-caption text-on-surface-variant">Đến</span>
                <input
                  className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-low text-label-md py-2 pl-7 pr-2 outline-none focus:border-primary transition-all font-semibold"
                  placeholder="Mọi giá"
                  type="text"
                  value={maxPrice < Infinity ? maxPrice.toLocaleString() : ''}
                  onChange={(e) => handleMaxPriceInput(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Brand Filters */}
        <div className="border-t border-outline-variant/20 pt-4">
          <h3 className="font-label-md text-label-md font-bold text-on-surface mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">brand_awareness</span>
            Thương hiệu
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
            {BRANDS.map((brand) => {
              const isChecked = selectedBrands.includes(brand)
              return (
                <label
                  key={brand}
                  className="flex items-center gap-2.5 px-1 py-1 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleBrand(brand)}
                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 cursor-pointer"
                  />
                  <span className={`font-body-md text-body-md transition-colors ${isChecked ? 'text-primary font-bold' : 'text-on-surface-variant group-hover:text-primary'}`}>
                    {brand}
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Fast shipping tag */}
        <div className="border-t border-outline-variant/20 pt-4">
          <div className="bg-primary/5 rounded-xl p-3 border border-primary/10 flex gap-2">
            <span className="material-symbols-outlined text-primary text-xl">bolt</span>
            <div>
              <p className="font-label-md text-label-md font-bold text-primary">Giao Hỏa Tốc 2H</p>
              <p className="font-caption text-caption text-on-surface-variant">Lọc các sản phẩm hỗ trợ giao hàng hỏa tốc trong ngày.</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
