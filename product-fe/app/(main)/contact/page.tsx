'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { toast } from 'sonner'
import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.')
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-background text-on-surface pb-20 md:pb-0">
      <Header />
      <main className="max-w-container-max mx-auto px-gutter py-stack-lg">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="font-heading text-display-lg text-on-surface">Liên hệ</h1>
            <p className="text-body-lg text-on-surface-variant">Chúng tôi luôn sẵn sàng lắng nghe bạn</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                { icon: 'mail', title: 'Email', content: 'support@tlmarket.vn' },
                { icon: 'phone', title: 'Hotline', content: '1900 1234 5678' },
                { icon: 'location_on', title: 'Địa chỉ', content: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh' },
                { icon: 'schedule', title: 'Giờ làm việc', content: 'Thứ 2 - Chủ nhật: 8:00 - 22:00' },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 p-4 bg-white rounded-xl shadow-sm border border-neutral-50">
                  <span className="material-symbols-outlined text-primary mt-1">{item.icon}</span>
                  <div>
                    <h3 className="font-label-md text-label-md font-bold text-on-surface">{item.title}</h3>
                    <p className="font-caption text-caption text-on-surface-variant">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-50 space-y-4">
              <h2 className="font-heading text-headline-sm text-on-surface">Gửi tin nhắn</h2>
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant">Họ tên</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                  className="w-full rounded-xl py-3 px-4 font-body-md text-body-md outline-none border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
                  className="w-full rounded-xl py-3 px-4 font-body-md text-body-md outline-none border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant">Tin nhắn</label>
                <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required
                  className="w-full rounded-xl py-3 px-4 font-body-md text-body-md outline-none border border-outline-variant bg-surface-container-low resize-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <button type="submit" className="w-full orange-gradient text-white py-3 rounded-xl font-heading font-bold hover:brightness-110 transition-all">
                Gửi tin nhắn
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
