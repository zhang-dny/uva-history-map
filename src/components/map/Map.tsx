'use client'

import { useState, useCallback, useMemo, useRef} from 'react'
import type { MapRef } from 'react-map-gl/maplibre'
import { getClusteredMapItems } from '@/lib/map/clustering'

import ReactMapGL, { 
  NavigationControl,
  MapLayerMouseEvent,
  ViewStateChangeEvent,
  Marker, 
} from 'react-map-gl/maplibre'

import { MAP_CONFIG, getMapStyle } from '@/lib/constants/map'
import type { MapProps, MapViewport } from './types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MapPopup } from '@/app/map/MapPopup'

function getClusterStyle(pointCount: number) {
  if (pointCount >= 8) {
    return {
      size: 'h-14 w-14 text-sm',
      tone: 'bg-red-600 hover:bg-red-700',
    }
  }

  if (pointCount >= 4) {
    return {
      size: 'h-12 w-12 text-xs',
      tone: 'bg-amber-600 hover:bg-amber-700',
    }
  }

  return {
    size: 'h-10 w-10 text-xs',
    tone: 'bg-primary hover:bg-primary/90',
  }
}

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
  const mapRef = useRef<MapRef | null>(null)
  const [viewport, setViewport] = useState<MapViewport>({
    longitude: initialViewport?.longitude ?? MAP_CONFIG.UVA_CENTER.longitude,
    latitude: initialViewport?.latitude ?? MAP_CONFIG.UVA_CENTER.latitude,
    zoom: initialViewport?.zoom ?? MAP_CONFIG.DEFAULT_ZOOM,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  })
  const [bounds, setBounds] = useState<[number, number, number, number]>([
    -180, -85, 180, 85, 
  ])
  const updateBoundsFromMap = useCallback(() => {
    const b = mapRef.current?.getBounds() // read from map instance
    if (!b) return
  
    const [[west, south], [east, north]] = b.toArray()
    const nextBounds: [number, number, number, number] = [west, south, east, north]
  
    // avoid unnecessary state updates if bounds didn't actually change
    setBounds((prev) => {
      const isSame =
        prev[0] === nextBounds[0] &&
        prev[1] === nextBounds[1] &&
        prev[2] === nextBounds[2] &&
        prev[3] === nextBounds[3]
      return isSame ? prev : nextBounds
    })
  }, [])
  
  const clusteredItems = useMemo(
    () =>
      getClusteredMapItems({
        markers,
        bounds,
        zoom: viewport.zoom,
      }),
    [markers, bounds, viewport.zoom]
  )

  
  const selectedMarker = 
    selectedBuildingId == null ? null : markers.find((m) => m.id === selectedBuildingId) ?? null

  const handleMove = useCallback((evt: ViewStateChangeEvent) => {
    const newViewport = evt.viewState
    setViewport(newViewport)
    updateBoundsFromMap()
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
      ref ={mapRef}
        {...viewport}
        onMove={handleMove}
        onLoad={updateBoundsFromMap}
        onClick={handleClick}
        mapStyle={getMapStyle()}
        minZoom={MAP_CONFIG.MIN_ZOOM}
        maxZoom={MAP_CONFIG.MAX_ZOOM}
        style={{ width: '100%', height: '100%' }}
        cursor={adminMode ? 'crosshair' : 'grab'}
      >
        <NavigationControl position="top-right" />
        {clusteredItems.map((item) => {
          if (item.kind === 'cluster') {
            const clusterStyle = getClusterStyle(item.pointCount)
            return (
              <Marker 
                key={item.id}
                longitude={item.longitude}
                latitude={item.latitude}
                anchor="center"
              >
                <button
                type="button"
                aria-label={`Zoom into cluster with ${item.pointCount} buildings`}
                className={`${clusterStyle.size} ${clusterStyle.tone} rounded-full text-primary-foreground font-semibold shadow-lg border-2 border-white transition-colors`}
                onClick={(e) => {
                  e.stopPropagation()
                  const zoomStep = item.pointCount >= 8 ? 2 : 1.5
                  const nextZoom = Math.min(viewport.zoom + zoomStep, MAP_CONFIG.MAX_ZOOM)

                  const nextViewport = {
                    ...viewport, 
                    longitude: item.longitude, 
                    latitude: item.latitude, 
                    zoom: nextZoom,
                  }
                  setViewport(nextViewport)
                  onViewportChange?.(nextViewport)
                  
                  requestAnimationFrame(() => {
                    updateBoundsFromMap()
                  })
                }}
                >
                  {item.pointCount} 
                </button>

              </Marker>
            )
          }
          const isSelected = selectedBuildingId === item.id
          return (
            <Marker
              key={`building-${item.id}`}
              longitude = {item.longitude}
              latitude = {item.latitude}
              anchor = "center"
            >
              <div
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation() // don't trigger map click/clear selection
                    onMarkerClick?.({
                      id: item.id,
                      longitude: item.longitude,
                      latitude: item.latitude,
                      building: item.building,
                    }) // bubble selected building up to AppShell (single source of truth)
                  }}
                >
                  <div
                    className={`${
                      isSelected
                        ? 'w-8 h-8 bg-blue-500' // selected marker style
                        : 'w-6 h-6 bg-orange-500' // default marker style
                    } rounded-full border-2 border-white shadow-lg hover:scale-110 transition-all`}
                  />
                </div>
            </Marker>
          )
        })

        }
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
