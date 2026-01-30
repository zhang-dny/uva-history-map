'use client'
import { Map } from "@/components/map"
import type { BuildingWithCoordinates } from "@/actions/buildings"
import type { MapMarker } from "@/components/map/types"

interface MapContainerProps {
  buildings?: BuildingWithCoordinates[]
  showLoginButton?: boolean
  adminMode?: boolean
}

export function MapContainer({ 
  buildings = [],
  showLoginButton = false,
  adminMode = false 
}: MapContainerProps) {
  // Convert buildings to markers
  const markers: MapMarker[] = buildings.map((building) => ({
    id: building.id,
    longitude: building.longitude,
    latitude: building.latitude,
    building: building,
  }))
  console.log('MapContainer markers:', markers.length)
  return (
    <div className="flex-1 relative">
      <Map 
        markers={markers}
        showLoginButton={showLoginButton}
        adminMode={adminMode}
      />
    </div>
  )
}