
import type { Building } from "@/types/database"
import type { ViewState } from "react-map-gl/maplibre"

/**
 * Map marker representing a building
 */
export interface MapMarker {
  id: string
  position: {
    longitude: number
    latitude: number
  }
  building: Building
}


export interface MapViewport extends ViewState {
  longitude: number
  latitude: number
  zoom: number
}

export interface MapProps {
  initialViewport?: Partial<MapViewport>
  markers?: MapMarker[]
  adminMode?: boolean
  showLoginButton?: boolean
  onMarkerClick?: (marker: MapMarker) => void
  onMapClick?: (coords: { longitude: number; latitude: number }) => void
  onViewportChange?: (viewport: MapViewport) => void

}
