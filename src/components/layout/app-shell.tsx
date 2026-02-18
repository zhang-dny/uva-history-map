'use client'

import { Sidebar } from "./sidebar"
import { MapContainer } from "./map-container"
import { getBuildings, createBuilding, deleteBuilding } from "@/actions/buildings"
import { useState, useEffect, useMemo } from "react"
import type { BuildingWithCoordinates } from "@/actions/buildings"
import { WelcomeBanner } from "@/app/(admin)/admin/WelcomeBanner"
import { useQueryState, parseAsInteger } from 'nuqs'
import { filterBuildings, getAvailableTags } from "@/lib/map/filters"
import { Button } from "@/components/ui/button"
import { BuildingDetail } from "@/components/shared/BuildingDetail"
import { ChevronLeft, ChevronRight } from "lucide-react"

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
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
    tags: string[]
  }) => {
    if (!pendingCoords) {
      setCreateBuildingError("Please click a point on the map first")
      return
    }

    setIsCreatingBuilding(true)
    setCreateBuildingError(null)

    const result = await createBuilding({
      title: values.title,
      description: values.description || null,
      tags: values.tags,
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

  const [isDeletingBuilding, setIsDeletingBuilding] = useState(false)
  const [deleteBuildingError, setDeleteBuildingError] = useState<string|null> (null)
  const handleDeleteBuilding = async () => {

    if(!selectedBuilding) return

    const confirmed = window.confirm(`Delete "${selectedBuilding.title}"?`)
    if (!confirmed) return


    setIsDeletingBuilding(true)
    setDeleteBuildingError(null)

    const result = await deleteBuilding(selectedBuilding.id)

    setIsDeletingBuilding(false)

    if(!result.success) {
      setDeleteBuildingError(result.errorMessage)
      return
    }

    const latest = await getBuildings()
    setBuildings(latest)
    setSelectedId(null)
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
    <div className="relative h-screen overflow-hidden">
      <WelcomeBanner />
      <div className="absolute inset-0 flex">
        <MapContainer 
        buildings={filteredBuildings} 
        adminMode={true} 
        onMarkerSelect={(building) => {
          setSelectedId(building.id)
          setDeleteBuildingError(null)
        }}

        onClearSelection={()=> {
          setSelectedId(null)
        }}
        onMapClick={handleMapClickForAddMode}
        pendingAddCoords={pendingCoords}
        selectedBuilding={selectedBuilding}
           />
      </div>

      <div
        className="absolute left-0 top-0 z-30 h-full transition-transform duration-300 ease-out"
        style={{
          transform: isSidebarCollapsed
            ? "translateX(calc(-100%))"
            : "translateX(0)",
        }}
      >
        <div className="relative h-full">
          <Sidebar
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
            }}
            isCreatingBuilding={isCreatingBuilding}
            createBuildingError={createBuildingError}
            onSubmitCreateBuilding={handleCreateBuilding}
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute right-0 top-1/2 z-40 h-10 w-10 -translate-y-1/2 translate-x-full rounded-l-none border-l-0 shadow"
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {selectedBuilding && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedId(null)}
        >
          <div
            className="w-full max-w-lg rounded-lg border bg-background p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Building Details</h2>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={isDeletingBuilding}
                  onClick={handleDeleteBuilding}
                >
                  {isDeletingBuilding ? "Deleting..." : "Delete"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isDeletingBuilding}
                  onClick={() => setSelectedId(null)}
                >
                  Close
                </Button>
              </div>
            </div>
            {deleteBuildingError && (
              <p className="mb-3 text-sm text-red-600">{deleteBuildingError}</p>
            )}
            <div className="space-y-4">
              <BuildingDetail building={selectedBuilding} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}