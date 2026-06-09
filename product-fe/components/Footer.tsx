'use client'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-100 mt-section-gap">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-section-gap px-gutter py-section-gap max-w-container-max mx-auto">
        <div className="col-span-1 md:col-span-1">
          <div className="text-headline-sm font-black text-on-surface mb-stack-md flex items-center gap-2">
            <img alt="TL Market Logo" className="h-8" src="/logo-removebg-preview.png" onError={(e) => { (e.target as HTMLElement).style.display = 'none' }} />
            <span className="font-heading text-headline-sm">TL Market</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Giải pháp mua sắm trực tuyến hàng đầu với những sản phẩm công nghệ mới nhất và chất lượng dịch vụ vượt trội.
          </p>
        </div>
        <div>
          <h4 className="font-heading text-label-md font-bold text-on-surface mb-stack-md">Khám phá</h4>
          <ul className="space-y-2">
            <li><Link className="font-body-md text-caption text-on-surface-variant hover:text-primary transition-all" href="/about">Về chúng tôi</Link></li>
            <li><Link className="font-body-md text-caption text-on-surface-variant hover:text-primary transition-all" href="/products">Tin tức công nghệ</Link></li>
            <li><Link className="font-body-md text-caption text-on-surface-variant hover:text-primary transition-all" href="/products">Khuyến mãi</Link></li>
            <li><Link className="font-body-md text-caption text-on-surface-variant hover:text-primary transition-all" href="/contact">Liên hệ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading text-label-md font-bold text-on-surface mb-stack-md">Hỗ trợ khách hàng</h4>
          <ul className="space-y-2">
            <li><Link className="font-body-md text-caption text-on-surface-variant hover:text-primary transition-all" href="/policy">Chính sách bảo hành</Link></li>
            <li><Link className="font-body-md text-caption text-on-surface-variant hover:text-primary transition-all" href="/policy">Đổi trả & Hoàn tiền</Link></li>
            <li><Link className="font-body-md text-caption text-on-surface-variant hover:text-primary transition-all" href="/guide">Hướng dẫn mua hàng</Link></li>
            <li><Link className="font-body-md text-caption text-on-surface-variant hover:text-primary transition-all" href="/contact">Liên hệ chúng tôi</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading text-label-md font-bold text-on-surface mb-stack-md">Bản tin</h4>
          <p className="font-body-md text-caption text-on-surface-variant mb-stack-sm">Nhận thông tin ưu đãi mới nhất từ chúng tôi.</p>
          <div className="flex gap-2">
            <input className="bg-surface border border-neutral-200 rounded-xl px-4 py-2.5 text-body-md w-full focus:ring-1 focus:ring-primary outline-none focus:border-primary transition-all" placeholder="Email của bạn" type="email" />
            <button className="orange-gradient text-white px-5 py-2.5 rounded-xl font-heading font-bold hover:brightness-110 transition-all shadow-sm">Gửi</button>
          </div>
        </div>
      </div>
      <div className="max-w-container-max mx-auto px-gutter py-stack-md border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-stack-md">
        <span className="font-caption text-caption text-on-surface-variant">© 2024 TL Market. All rights reserved.</span>
        <div className="flex gap-stack-md">
          <a className="text-on-surface-variant hover:text-primary transition-all" href="#"><span className="material-symbols-outlined">public</span></a>
          <a className="text-on-surface-variant hover:text-primary transition-all" href="#"><span className="material-symbols-outlined">share</span></a>
          <a className="text-on-surface-variant hover:text-primary transition-all" href="#"><span className="material-symbols-outlined">mail</span></a>
        </div>
      </div>
    </footer>
  )
}
