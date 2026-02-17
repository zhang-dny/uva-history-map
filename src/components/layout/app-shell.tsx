'use client'

import { Sidebar } from "./sidebar"
import { MapContainer } from "./map-container"
import { getBuildings, createBuilding } from "@/actions/buildings"
import { useState, useEffect, useMemo } from "react"
import type { BuildingWithCoordinates } from "@/actions/buildings"
import { WelcomeBanner } from "@/app/(admin)/admin/WelcomeBanner"
import { useQueryState, parseAsInteger } from 'nuqs'
import { filterBuildings, getAvailableTags } from "@/lib/map/filters"
import { Tag } from "lucide-react"

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


  const [isAddMode, setIsAddMode] = useState(false)
  const [pendingCoords, setPendingCoords] = useState<{ longitude: number; latitude: number } | null>(null)
  const handleMapClickForAddMode = (coords: { longitude: number; latitude: number }) => {
    if (!isAddMode) return
    setPendingCoords(coords)
    setSelectedId(null)
  }


  const [isCreatingBuilding, setIsCreatingBuilding] = useState(false)
  const [createBuildingError, setCreateBuildingError] = useState<string| null> (null) 
  const handleCreateBuilding = async (values: {
    title: string
    description: string
    tagText: string
  }) => {
    if (!pendingCoords) {
      setCreateBuildingError("Please click a point on the map first")
      return
    }

    setIsCreatingBuilding(true)
    setCreateBuildingError(null)

    const tags = values.tagText.split(",").map((tag) => tag.trim()).filter(Boolean)

    const result = await createBuilding({
      title: values.title,
      description: values.description || null,
      tags,
      location: {
        type: "Point",
        coordinates: [pendingCoords.longitude, pendingCoords.latitude],
      },
    })

    setIsCreatingBuilding(false)

    if (!result.success) {
      setCreateBuildingError(result.error)
      return
    }
    const latest = await getBuildings()
    setBuildings(latest)
  
    // Exit add mode + clear state
    setIsAddMode(false)
    setPendingCoords(null)
    setCreateBuildingError(null)

  }



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
        isAddMode={isAddMode}
        pendingCoords={pendingCoords}
        onStartAddMode={() => {
          setIsAddMode(true)
          setPendingCoords(null)
        }}
        onCancelAddMode={() => {
          setIsAddMode(false)
          setPendingCoords(null)
        }
      }
      isCreatingBuilding={isCreatingBuilding}
      createBuildingError={createBuildingError}
      onSubmitCreateBuilding={handleCreateBuilding}

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
      onMapClick={handleMapClickForAddMode}
      pendingAddCoords={pendingCoords}
         />
    </div>
  )
}