'use client'

/**
 * Prevents server side rendering of the map, causing crashes on the client side.
 * Use this export to prevent SSR issues with maplibre-gl.
 */

import dynamic from 'next/dynamic'

function MapSkeleton() {
  return (
    <div className="w-full h-full bg-muted/20 animate-pulse flex items-center justify-center">
      <div className="text-center space-y-2">
        <div className="text-4xl">🗺️</div>
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  )
}

export const Map = dynamic(
  () => import('./Map').then((mod) => ({ default: mod.Map })),
  {
    ssr: false,
    loading: () => <MapSkeleton />,
  }
)
