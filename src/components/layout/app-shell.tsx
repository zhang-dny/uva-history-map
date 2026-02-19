'use client'

import { Sidebar } from "./sidebar"
import { MapContainer } from "./map-container"
import { getBuildings, createBuilding, deleteBuilding, updateBuilding } from "@/actions/buildings"
import { useState, useEffect, useMemo } from "react"
import type { BuildingWithCoordinates } from "@/actions/buildings"
import { WelcomeBanner } from "@/app/(admin)/admin/WelcomeBanner"
import { useQueryState, parseAsInteger } from 'nuqs'
import { filterBuildings, getAvailableTags } from "@/lib/map/filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

  const [isEditingBuilding, setIsEditingBuilding] = useState(false)
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [editBuildingError, setEditBuildingError] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editTags, setEditTags] = useState<string[]>([])

  const editTagOptions = useMemo(() => {
    const selectedTags = selectedBuilding?.tags ?? []
    return Array.from(new Set([...availableTags, ...selectedTags])).sort((a, b) =>
      a.localeCompare(b)
    )
  }, [availableTags, selectedBuilding])

  const toggleEditTag = (tag: string) => {
    setEditTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleStartEdit = () => {
    if (!selectedBuilding) return
    setEditTitle(selectedBuilding.title)
    setEditDescription(selectedBuilding.description ?? "")
    setEditTags(selectedBuilding.tags ?? [])
    setEditBuildingError(null)
    setIsEditingBuilding(true)
  }

  const handleCancelEdit = () => {
    setIsEditingBuilding(false)
    setIsSavingEdit(false)
    setEditBuildingError(null)
  }

  const handleSaveEdit = async () => {
    if (!selectedBuilding) return

    const trimmedTitle = editTitle.trim()
    if (!trimmedTitle) {
      setEditBuildingError("Title is required")
      return
    }

    setIsSavingEdit(true)
    setEditBuildingError(null)

    const result = await updateBuilding(selectedBuilding.id, {
      title: trimmedTitle,
      description: editDescription.trim() ? editDescription.trim() : null,
      tags: editTags,
    })

    setIsSavingEdit(false)

    if (!result.success) {
      setEditBuildingError(result.error)
      return
    }

    const latest = await getBuildings()
    setBuildings(latest)
    setIsEditingBuilding(false)
    setEditBuildingError(null)
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
          setEditBuildingError(null)
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
                {isEditingBuilding ? (
                  <>
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      disabled={isSavingEdit}
                      onClick={handleSaveEdit}
                    >
                      {isSavingEdit ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isSavingEdit}
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={isDeletingBuilding}
                      onClick={handleStartEdit}
                    >
                      Edit
                    </Button>
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
                  </>
                )}
              </div>
            </div>
            {deleteBuildingError && (
              <p className="mb-3 text-sm text-red-600">{deleteBuildingError}</p>
            )}
            {editBuildingError && (
              <p className="mb-3 text-sm text-red-600">{editBuildingError}</p>
            )}
            <div className="space-y-4">
              {isEditingBuilding ? (
                <>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Building title"
                  />
                  <textarea
                    className="w-full min-h-24 rounded-md border bg-background px-3 py-2 text-sm"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Description (optional)"
                  />
                  <div className="rounded-md border bg-background p-2">
                    <p className="mb-2 text-xs text-muted-foreground">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {editTagOptions.map((tag) => {
                        const isActive = editTags.includes(tag)
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleEditTag(tag)}
                            className={`rounded-md border px-2 py-1 text-xs transition-colors ${
                              isActive
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-muted/30 hover:bg-muted"
                            }`}
                          >
                            {tag}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <BuildingDetail building={selectedBuilding} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}