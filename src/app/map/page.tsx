import { MapContainer } from "@/components/layout/map-container"

export default function PublicMapPage() {
  return (
    <div className="flex h-screen w-full">
      <MapContainer showLoginButton = {true} />
    </div>
  )
}