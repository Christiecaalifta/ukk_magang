'use client'

import { useEffect } from 'react'
import { CheckCircle2, X } from 'lucide-react'

export default function Toast({
  message,
  onClose,
  duration = 3000,
}: {
  message: string
  onClose: () => void
  duration?: number
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [onClose, duration])

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-toast-in">

      {/* CARD */}
      <div className="flex items-center gap-3 
        bg-gradient-to-r from-emerald-500 to-teal-500
        text-white px-4 py-3 rounded-xl shadow-xl
        border border-white/20
        backdrop-blur-sm
      ">

        {/* ICON */}
        <div className="bg-white/20 p-1.5 rounded-full">
          <CheckCircle2 size={18} />
        </div>

        {/* TEXT */}
        <p className="text-sm font-semibold tracking-wide">
          {message}
        </p>

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="ml-2 opacity-80 hover:opacity-100 transition"
        >
          <X size={16} />
        </button>

      </div>
    </div>
  )
}
