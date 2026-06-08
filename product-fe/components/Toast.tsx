'use client'

import { useApp } from '@/lib/store'

import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'


import { useEffect, useState } from 'react'


export default function Toast() {
    const { notifications, removeNotification } = useApp()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // Defer to avoid react-hooks/set-state-in-effect lint issues
        const t = window.setTimeout(() => setMounted(true), 0)
        return () => window.clearTimeout(t)
    }, [])


    if (!mounted) return null

    const getIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-500" />
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-500" />
            case 'info':
                return <Info className="w-5 h-5 text-blue-500" />
            default:
                return null
        }
    }

    const getBackgroundColor = (type: string) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200'
            case 'error':
                return 'bg-red-50 border-red-200'
            case 'warning':
                return 'bg-yellow-50 border-yellow-200'
            case 'info':
                return 'bg-blue-50 border-blue-200'
            default:
                return 'bg-gray-50 border-gray-200'
        }
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
            {notifications.map((notif: { id: string; message: string; type: string }) => (
                <div
                    key={notif.id}

                    className={`flex items-center gap-3 p-4 rounded-lg border ${getBackgroundColor(notif.type)} animate-in slide-in-from-right`}
                >
                    {getIcon(notif.type)}
                    <p className="flex-1 text-sm font-medium">{notif.message}</p>
                    <button
                        type="button"
                        onClick={() => removeNotification(notif.id)}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="Dismiss notification"
                    >
                        <X className="w-4 h-4" />
                    </button>

                </div>
            ))}
        </div>
    )
}
