import { Map } from "@/components/map"

interface MapContainerProps {
  showLoginButton?: boolean
  adminMode?: boolean
}

export function MapContainer({
  showLoginButton = false,
  adminMode = false,
}: MapContainerProps) {
  return (
    <div className="flex-1 relative">
      <Map 
        showLoginButton={showLoginButton}
        adminMode={adminMode}
      />
    </div>
  )
}