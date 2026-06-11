'use client'
export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-headline-md font-heading font-bold text-primary">Quản lý nội dung</h2>
          <p className="text-on-surface-variant text-body-md">Banner, danh mục, đánh giá sản phẩm</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low p-6 rounded-xl shadow-sm border border-border-subtle">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">view_carousel</span>
            <h3 className="text-title-md font-bold">Banner</h3>
          </div>
          <p className="text-body-sm text-on-surface-variant mb-4">Quản lý banner quảng cáo trang chủ</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-on-surface-variant">Đang hoạt động: 3</span>
            <button className="text-primary font-bold hover:underline">Quản lý</button>
          </div>
        </div>

        <div className="bg-surface-container-low p-6 rounded-xl shadow-sm border border-border-subtle">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">category</span>
            <h3 className="text-title-md font-bold">Danh mục</h3>
          </div>
          <p className="text-body-sm text-on-surface-variant mb-4">Quản lý danh mục sản phẩm</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-on-surface-variant">Danh mục: 5</span>
            <button className="text-primary font-bold hover:underline">Quản lý</button>
          </div>
        </div>

        <div className="bg-surface-container-low p-6 rounded-xl shadow-sm border border-border-subtle">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">rate_review</span>
            <h3 className="text-title-md font-bold">Đánh giá</h3>
          </div>
          <p className="text-body-sm text-on-surface-variant mb-4">Duyệt và quản lý đánh giá sản phẩm</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-on-surface-variant">Chờ duyệt: 12</span>
            <button className="text-primary font-bold hover:underline">Quản lý</button>
          </div>
        </div>
      </div>
    </div>
  )
}
