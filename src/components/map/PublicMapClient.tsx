'use client'
import { MapContainer } from "@/components/layout/map-container"
import {useState, useEffect, useMemo} from 'react'
import { getBuildings } from "@/actions/buildings"
import type { BuildingWithCoordinates } from "@/actions/buildings"
import { useQueryState, parseAsInteger } from 'nuqs'
import {
  Sheet,
  SheetContent, 
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import { BuildingDetail } from "@/components/shared/BuildingDetail"


export default function PublicMapClient() {
  const [buildings, setBuildings] = useState<BuildingWithCoordinates[]>([])
  const [loading, setLoading] = useState(true)
  
  const [selectedId, setSelectedId] = useQueryState(
    'id', 
    parseAsInteger
  )

  const selectedBuilding = useMemo(() => {
    if (!selectedId || !buildings.length) return null
    return buildings.find((b) => b.id === selectedId) ?? null
  }, [selectedId, buildings])
  
  useEffect(() => {
    getBuildings()
      .then(data => {
        setBuildings(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching buildings:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="flex h-screen items-center justify-center"> Loading Map...</div>
  }
  return (
    <div className="flex h-screen w-full">
      <MapContainer 
      buildings = {buildings}
      showLoginButton = {true}
      onMarkerSelect={(buildings) => setSelectedId(buildings.id)}
      selectedBuilding={selectedBuilding}
      onClearSelection={() => setSelectedId(null)}
       />

       <Sheet open={selectedBuilding !== null} onOpenChange={(open) => {if (!open) setSelectedId(null)}}>
       <SheetContent>
          <SheetHeader>
            <SheetTitle>Building Details</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <BuildingDetail building={selectedBuilding} />
          </div>
        </SheetContent>
       </Sheet>
    </div>
  )
}

