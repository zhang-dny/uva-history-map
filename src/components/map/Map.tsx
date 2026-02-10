'use client'

import { useState, useCallback } from 'react'

import ReactMapGL, { 
  NavigationControl,
  MapLayerMouseEvent,
  ViewStateChangeEvent,
  Marker
} from 'react-map-gl/maplibre'

import { MAP_CONFIG, getMapStyle } from '@/lib/constants/map'
import type { MapMarker, MapProps, MapViewport } from './types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import 'maplibre-gl/dist/maplibre-gl.css'
import { MapPopup } from '@/app/map/MapPopup'

export function Map({
  initialViewport,
  markers = [],
  adminMode = false,
  onMarkerClick,
  onMapClick,
  onViewportChange,
  showLoginButton = false,
  selectedBuildingId = null,
  onClearSelection,
}: MapProps) {

  const [viewport, setViewport] = useState<MapViewport>({
    longitude: initialViewport?.longitude ?? MAP_CONFIG.UVA_CENTER.longitude,
    latitude: initialViewport?.latitude ?? MAP_CONFIG.UVA_CENTER.latitude,
    zoom: initialViewport?.zoom ?? MAP_CONFIG.DEFAULT_ZOOM,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  })
  const selectedMarker = 
    selectedBuildingId == null ? null : markers.find((m) => m.id === selectedBuildingId) ?? null

  const handleMove = useCallback((evt: ViewStateChangeEvent) => {
    const newViewport = evt.viewState
    setViewport(newViewport)
    onViewportChange?.(newViewport)
  }, [onViewportChange])

  const handleClick = useCallback((evt: MapLayerMouseEvent) => {
    onClearSelection?.()
    if (adminMode && onMapClick) {
      const { lng, lat } = evt.lngLat
      onMapClick({ longitude: lng, latitude: lat })
    }
  }, [adminMode, onMapClick, onClearSelection])

  return (
    <div className="relative w-full h-full">
      <ReactMapGL
        {...viewport}
        onMove={handleMove}
        onClick={handleClick}
        mapStyle={getMapStyle()}
        minZoom={MAP_CONFIG.MIN_ZOOM}
        maxZoom={MAP_CONFIG.MAX_ZOOM}
        style={{ width: '100%', height: '100%' }}
        cursor={adminMode ? 'crosshair' : 'grab'}
      >
        <NavigationControl position="top-right" />
        {markers.map((marker) => {
          const isSelected = selectedBuildingId === marker.id
          
          return (
            <Marker
              key={marker.id}
              longitude={marker.longitude}
              latitude={marker.latitude}
              anchor="center"
            >
              <div 
                className="cursor-pointer" 
                onClick={(e) => {
                  e.stopPropagation()
                  console.log('Marker clicked:', marker.building.title)
                  onMarkerClick?.(marker)
                }}
              >
                <div 
                  className={`${
                    isSelected 
                      ? 'w-8 h-8 bg-blue-500'  // Selected: bigger and blue
                      : 'w-6 h-6 bg-orange-500'    // Normal: smaller and red
                  } rounded-full border-2 border-white shadow-lg hover:scale-110 transition-all`} 
                />
              </div>
            </Marker>
          )
        })}
        {/* Show popup when marker is selected */}
        {selectedMarker && (
        <MapPopup
          building={selectedMarker.building}
          longitude={selectedMarker.longitude}
          latitude={selectedMarker.latitude}
          onClose={() => onClearSelection?.()}
        />
      )}
      </ReactMapGL>
      
      {adminMode && (
        <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium">
          Admin Mode
        </div>
      )}
      {showLoginButton && (
        <div className="absolute top-4 right-16">
          <Link href="/login">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </Link> 
        </div>
      )}
    </div>
  )
}
