'use client'
import { MapContainer } from "@/components/layout/map-container"
import {useState, useEffect, useMemo} from 'react'
import { getBuildings } from "@/actions/buildings"
import type { BuildingWithCoordinates } from "@/actions/buildings"
import { useQueryState, parseAsInteger } from 'nuqs'
import { BuildingDetail } from "@/components/shared/BuildingDetail"
import { filterBuildings, getAvailableTags } from "@/lib/map/filters"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"



export default function PublicMapClient() {
  const [buildings, setBuildings] = useState<BuildingWithCoordinates[]>([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  
  const [selectedId, setSelectedId] = useQueryState(
    'id', 
    parseAsInteger
  )
  const availableTags = useMemo(() => getAvailableTags(buildings), [buildings])

  const filteredBuildings = useMemo(
  () => filterBuildings(buildings, { searchText, selectedTag }),
    [buildings, searchText, selectedTag]
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
       <div className="absolute left-4 top-4 z-20 w-80 space-y-2 rounded-md border bg-background/95 p-3 shadow">
    <Input
      placeholder="Search buildings..."
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
    />

    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        size="sm"
        variant={selectedTag === null ? "default" : "outline"}
        onClick={() => setSelectedTag(null)}
      >
        All
      </Button>

      {availableTags.map((tag) => (
        <Button
          key={tag}
          type="button"
          size="sm"
          variant={selectedTag === tag ? "default" : "outline"}
          onClick={() => setSelectedTag(tag)}
        >
          {tag}
        </Button>
      ))}
    </div>
  </div>  
      <MapContainer 
      buildings = {filteredBuildings}
      showLoginButton = {true}
      onMarkerSelect={(building) => setSelectedId(building.id)}
      selectedBuilding={selectedBuilding}
      onClearSelection={() => setSelectedId(null)}
       />

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
              <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedId(null)}>
                Close
              </Button>
            </div>
            <div className="space-y-4">
              <BuildingDetail building={selectedBuilding} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

