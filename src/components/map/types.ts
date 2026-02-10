import type { BuildingWithCoordinates } from "@/actions/buildings"
import type { ViewState } from "react-map-gl/maplibre"

/**
 * Map marker representing a building
 */
export interface MapMarker {
  id: number
  longitude: number
  latitude: number
  building: BuildingWithCoordinates
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
  selectedBuildingId?: number | null
  onClearSelection?: () => void
}
