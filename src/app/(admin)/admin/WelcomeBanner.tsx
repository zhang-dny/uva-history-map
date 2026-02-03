'use client'
 
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export function WelcomeBanner() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const dismissed = localStorage.getItem('admin-welcome-dismissed')
        if (!dismissed) {
            setIsVisible(true)
        }
    }, [])

    const handleDismiss = () => {
        localStorage.setItem('admin-welcome-dismissed', 'true')
        setIsVisible(false)
    }
    if (!isVisible) return null

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 max-w-md">
      <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4 flex items-start gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">
            🎓 Welcome to Admin Mode Dani!
          </h3>
          <p className="text-xs opacity-90">
            You're now in historian mode! More features will be added soon.          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="hover:bg-white/20 rounded p-1 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
    )
} 