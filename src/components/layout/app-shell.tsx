'use client'

import { Sidebar } from "./sidebar"
import { MapContainer } from "./map-container"
import { getBuildings } from "@/actions/buildings"
import { useState, useEffect, useMemo } from "react"
import type { BuildingWithCoordinates } from "@/actions/buildings"
import { WelcomeBanner } from "@/app/(admin)/admin/WelcomeBanner"
import { useQueryState, parseAsInteger } from 'nuqs'
import { filterBuildings, getAvailableTags } from "@/lib/map/filters"
import { getActiveResourcesInfo } from "process"

export function AppShell() {
  const [buildings, setBuildings] = useState<BuildingWithCoordinates[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useQueryState (
    'id', 
    parseAsInteger
  )
  const [searchText, setSearchText] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const selectedBuilding = useMemo(() => {
    if (!selectedId || !buildings.length) return null
    return buildings.find((b) => b.id === selectedId) ?? null
  }, [selectedId, buildings])
  const availableTags = useMemo(() => getAvailableTags(buildings), [buildings])

  const filteredBuildings = useMemo(
  () => filterBuildings(buildings, { searchText, selectedTag }),
  [buildings, searchText, selectedTag]
  )
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
      <Sidebar
        selectedBuilding={selectedBuilding}
        searchText={searchText}
        selectedTag={selectedTag}
        availableTags={availableTags}
        onSearchTextChange={setSearchText}
        onSelectedTagChange={setSelectedTag}
      />
      <MapContainer 
      buildings={filteredBuildings} 
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