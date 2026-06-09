'use client'
import { useState } from 'react'
import Link from 'next/link'
import { userApi } from '@/lib/api/userApi'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function ManagerCreateUserPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState('manager')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setIsSubmitting(true)
    try {
      await userApi.create({
        username: form.username,
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        role: selectedRole,
      })
      toast.success('User created successfully')
      router.push('/dashboard/manager/users')
    } catch {
      toast.error('Failed to create user')
    } finally {
      setIsSubmitting(false)
    }
  }

  const roleColor = (role: string): string => {
    if (role === 'admin') return '#0035d1'
    if (role === 'manager') return '#FF6B00'
    return '#4958a9'
  }

  return (
    <div className="flex justify-center items-start py-4">
      <div className="w-full max-w-4xl bg-m3-surface rounded-[2rem] shadow-sm border border-m3-outline-variant/30 overflow-hidden">
        <div className="bg-gradient-to-r from-m3-primary to-m3-secondary p-8 text-white">
          <h2 className="text-[28px] font-bold leading-[36px] mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
            Registration Form
          </h2>
          <p className="text-m3-primary-fixed/80 text-sm">
            Populate the fields below to provision a new user account with specific role-based permissions.
          </p>
        </div>

        <form className="p-8 md:p-12 space-y-10" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl bg-m3-surface-container-high border-2 border-dashed border-m3-outline-variant flex flex-col items-center justify-center group-hover:bg-m3-surface-variant transition-all cursor-pointer">
                <span className="material-symbols-outlined text-m3-outline text-4xl mb-1">add_a_photo</span>
                <p className="text-[10px] text-m3-outline font-bold">UPLOAD</p>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-brand-orange text-white p-1 rounded-lg shadow-lg">
                <span className="material-symbols-outlined text-sm">edit</span>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-[22px] font-bold leading-[28px] text-m3-on-surface" style={{ fontFamily: 'Sora, sans-serif' }}>
                User Profile Avatar
              </h3>
              <p className="text-sm text-m3-on-surface-variant">Recommended size: 400x400px. Supports JPG, PNG.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-m3-on-surface-variant px-1">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Jonathan Doe"
                value={form.fullName}
                onChange={(e) => setForm(f => ({ ...f, fullName: e.target.value }))}
                className="w-full h-14 px-4 bg-m3-surface-container-lowest border border-m3-outline-variant rounded-2xl focus:ring-2 focus:ring-m3-primary focus:border-transparent transition-all outline-none text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-m3-on-surface-variant px-1">Username</label>
              <input
                type="text"
                placeholder="johndoe_tl"
                value={form.username}
                onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
                className="w-full h-14 px-4 bg-m3-surface-container-lowest border border-m3-outline-variant rounded-2xl focus:ring-2 focus:ring-m3-primary focus:border-transparent transition-all outline-none text-sm"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-m3-on-surface-variant px-1">Work Email Address</label>
              <input
                type="email"
                placeholder="jonathan.doe@tlmarket.com"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full h-14 px-4 bg-m3-surface-container-lowest border border-m3-outline-variant rounded-2xl focus:ring-2 focus:ring-m3-primary focus:border-transparent transition-all outline-none text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-m3-on-surface-variant px-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full h-14 px-4 bg-m3-surface-container-lowest border border-m3-outline-variant rounded-2xl focus:ring-2 focus:ring-m3-primary focus:border-transparent transition-all outline-none text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-m3-outline cursor-pointer"
                >
                  <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-m3-on-surface-variant px-1">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                className="w-full h-14 px-4 bg-m3-surface-container-lowest border border-m3-outline-variant rounded-2xl focus:ring-2 focus:ring-m3-primary focus:border-transparent transition-all outline-none text-sm"
              />
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-m3-outline-variant/20">
            <h3 className="text-[22px] font-bold leading-[28px] text-m3-on-surface" style={{ fontFamily: 'Sora, sans-serif' }}>
              Assign Access Role
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: 'admin', label: 'Admin', icon: 'shield_person', description: 'Can manage inventory, orders, and view basic reports.' },
                { value: 'manager', label: 'Manager', icon: 'military_tech', description: 'Full access to system, users, and financial analytics.' },
                { value: 'user', label: 'Standard User', icon: 'person', description: 'Customer-level access with order tracking only.' },
              ].map((role) => {
                const isChecked = selectedRole === role.value
                const checkedBg = role.value === 'admin' ? 'bg-m3-primary-container/5' : role.value === 'manager' ? 'bg-brand-orange-container/20' : 'bg-m3-secondary-container/10'

                return (
                  <label
                    key={role.value}
                    className={`relative flex flex-col p-6 border-2 rounded-2xl cursor-pointer transition-all group ${isChecked ? checkedBg : ''}`}
                    style={{ borderColor: isChecked ? roleColor(role.value) : '#c4c5d9' }}
                    onClick={() => setSelectedRole(role.value)}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={isChecked}
                      onChange={() => setSelectedRole(role.value)}
                      className="absolute opacity-0"
                    />
                    <div className="flex justify-between items-start mb-4">
                      <span className="material-symbols-outlined" style={{ color: roleColor(role.value) }}>{role.icon}</span>
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                        style={{
                          backgroundColor: isChecked ? roleColor(role.value) : 'transparent',
                          borderColor: isChecked ? roleColor(role.value) : '#c4c5d9',
                        }}
                      >
                        {isChecked && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>
                    <span className="font-bold text-m3-on-surface">{role.label}</span>
                    <p className="text-xs text-m3-on-surface-variant mt-2 leading-tight">{role.description}</p>
                  </label>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row items-center justify-end gap-4 pt-8">
            <Link
              href="/dashboard/manager/users"
              className="w-full md:w-auto px-8 py-4 font-bold text-m3-on-surface-variant hover:text-m3-on-surface transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-48 py-4 bg-gradient-to-r from-brand-orange to-red-500 text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ boxShadow: '0 10px 15px -3px rgba(255, 109, 0, 0.25)' }}
            >
              <span>{isSubmitting ? 'Creating...' : 'Create User'}</span>
              <span className="material-symbols-outlined">person_add</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
