'use client'
import { useState, useEffect } from 'react'

export default function CountdownTimer() {
  const [time, setTime] = useState({ h: '00', m: '00', s: '00' })

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)
      const diff = end.getTime() - now.getTime()
      setTime({
        h: String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
        m: String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0'),
        s: String(Math.floor((diff / 1000) % 60)).padStart(2, '0'),
      })
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex gap-1.5 items-center">
      <span className="text-label-md font-bold text-on-surface-variant">Kết thúc trong:</span>
      {[time.h, time.m, time.s].map((val, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="font-bold text-on-surface">:</span>}
          <span className="bg-flash-sale text-white px-2 py-1 rounded-lg font-sora font-bold text-sm min-w-[2rem] text-center">
            {val}
          </span>
        </span>
      ))}
    </div>
  )
}
