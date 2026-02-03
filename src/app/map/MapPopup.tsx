'use client'

import { Popup } from 'react-map-gl/maplibre'
import type { BuildingWithCoordinates } from '@/actions/buildings'

interface MapPopupProps {
  building: BuildingWithCoordinates
  longitude: number
  latitude: number
  onClose: () => void
}

export function MapPopup({ building, longitude, latitude, onClose }: MapPopupProps) {
  return (
    <Popup
      longitude={longitude}
      latitude={latitude}
      onClose={onClose}
      closeButton={true}
      closeOnClick={false}
      anchor="bottom"
      offset={25}
    >
      <div className="p-3 min-w-64">
        <h3 className="font-semibold text-base mb-2">{building.title}</h3>
        
        {building.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
            {building.description}
          </p>
        )}
        
        {building.tags && building.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {building.tags.map(tag => (
              <span
                key={tag}
                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Popup>
  )
}