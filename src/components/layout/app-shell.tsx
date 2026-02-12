'use client'

import { Sidebar } from "./sidebar"
import { MapContainer } from "./map-container"
import { getBuildings } from "@/actions/buildings"
import { useState, useEffect, useMemo } from "react"
import type { BuildingWithCoordinates } from "@/actions/buildings"
import { WelcomeBanner } from "@/app/(admin)/admin/WelcomeBanner"
import { useQueryState, parseAsInteger } from 'nuqs'

export function AppShell() {
  const [buildings, setBuildings] = useState<BuildingWithCoordinates[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useQueryState (
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
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <WelcomeBanner />
      <Sidebar selectedBuilding={selectedBuilding} />
      <MapContainer 
      buildings={buildings} 
      adminMode={true} 
      onMarkerSelect={(building) => {
        setSelectedId(building.id)
      }}

      onClearSelection={()=> {
        setSelectedId(null)
      }}
         />
    </div>
  )
}