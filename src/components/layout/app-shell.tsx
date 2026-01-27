import { Sidebar } from "./sidebar"
import { MapContainer } from "./map-container"

export function AppShell() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <MapContainer />
    </div>
  )
}