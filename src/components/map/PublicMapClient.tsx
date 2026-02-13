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

