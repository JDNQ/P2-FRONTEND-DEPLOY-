'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ManagerCreateUserPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState('manager')

  return (
    <div className="flex justify-center items-start py-4">
      <div className="w-full max-w-4xl bg-surface rounded-[2rem] shadow-sm border border-outline-variant/30 overflow-hidden">
        {/* Header Gradient */}
        <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white">
          <h2 className="text-[28px] font-bold leading-[36px] mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
            Registration Form
          </h2>
          <p className="text-primary-fixed-dim/80 text-sm">
            Populate the fields below to provision a new user account with specific role-based permissions.
          </p>
        </div>

        <form className="p-8 md:p-12 space-y-10">
          {/* Profile Picture Upload */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl bg-surface-container-high border-2 border-dashed border-outline-variant flex flex-col items-center justify-center group-hover:bg-surface-variant transition-all cursor-pointer">
                <span className="material-symbols-outlined text-outline text-4xl mb-1">add_a_photo</span>
                <p className="text-[10px] text-outline font-bold">UPLOAD</p>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-brand-orange text-white p-1 rounded-lg shadow-lg">
                <span className="material-symbols-outlined text-sm">edit</span>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-[22px] font-bold leading-[28px] text-on-surface" style={{ fontFamily: 'Sora, sans-serif' }}>
                User Profile Avatar
              </h3>
              <p className="text-sm text-on-surface-variant">Recommended size: 400x400px. Supports JPG, PNG.</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface-variant px-1">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Jonathan Doe"
                className="w-full h-14 px-4 bg-surface-container-lowest border border-outline-variant rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface-variant px-1">Username</label>
              <input
                type="text"
                placeholder="johndoe_tl"
                className="w-full h-14 px-4 bg-surface-container-lowest border border-outline-variant rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-sm"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-on-surface-variant px-1">Work Email Address</label>
              <input
                type="email"
                placeholder="jonathan.doe@tlmarket.com"
                className="w-full h-14 px-4 bg-surface-container-lowest border border-outline-variant rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface-variant px-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full h-14 px-4 bg-surface-container-lowest border border-outline-variant rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline cursor-pointer"
                >
                  <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface-variant px-1">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full h-14 px-4 bg-surface-container-lowest border border-outline-variant rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-sm"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-4 pt-6 border-t border-outline-variant/20">
            <h3 className="text-[22px] font-bold leading-[28px] text-on-surface" style={{ fontFamily: 'Sora, sans-serif' }}>
              Assign Access Role
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: 'admin', label: 'Admin', icon: 'shield_person', description: 'Can manage inventory, orders, and view basic reports.', color: 'primary', checkedColor: 'primary' },
                { value: 'manager', label: 'Manager', icon: 'military_tech', description: 'Full access to system, users, and financial analytics.', color: 'brand-orange', checkedColor: 'brand-orange' },
                { value: 'user', label: 'Standard User', icon: 'person', description: 'Customer-level access with order tracking only.', color: 'secondary', checkedColor: 'secondary' },
              ].map((role) => {
                const isChecked = selectedRole === role.value
                const borderColor = isChecked ? role.checkedColor : 'outline-variant'
                const bgClass = isChecked
                  ? role.value === 'admin'
                    ? 'bg-primary-container/5'
                    : role.value === 'manager'
                      ? 'bg-brand-orange-container/20'
                      : 'bg-secondary-container/10'
                  : ''

                return (
                  <label
                    key={role.value}
                    className={`relative flex flex-col p-6 border-2 rounded-2xl cursor-pointer transition-all group ${bgClass}`}
                    style={{ borderColor: `var(--tw-border-opacity, 1) rgba(var(--color-${borderColor}), var(--tw-border-opacity))` }}
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
                      <span className={`material-symbols-outlined text-${role.color}`}>{role.icon}</span>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isChecked ? 'border-' + role.checkedColor : 'border-outline-variant'
                        }`}
                        style={{
                          backgroundColor: isChecked
                            ? role.value === 'admin'
                              ? '#0035d1'
                              : role.value === 'manager'
                                ? '#ff6d00'
                                : '#4958a9'
                            : 'transparent',
                          borderColor: isChecked
                            ? role.value === 'admin'
                              ? '#0035d1'
                              : role.value === 'manager'
                                ? '#ff6d00'
                                : '#4958a9'
                            : '#c4c5d9',
                        }}
                      >
                        {isChecked && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>
                    <span className="font-bold text-on-surface">{role.label}</span>
                    <p className="text-xs text-on-surface-variant mt-2 leading-tight">{role.description}</p>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse md:flex-row items-center justify-end gap-4 pt-8">
            <Link
              href="/dashboard/manager/users"
              className="w-full md:w-auto px-8 py-4 font-bold text-on-surface-variant hover:text-on-surface transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="w-full md:w-48 py-4 bg-gradient-to-r from-brand-orange to-red-500 text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              style={{ boxShadow: '0 10px 15px -3px rgba(255, 109, 0, 0.25)' }}
            >
              <span>Create User</span>
              <span className="material-symbols-outlined">person_add</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
