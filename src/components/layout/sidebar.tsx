import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"    
import { signOut } from "@/actions/auth"
import type { BuildingWithCoordinates } from "@/actions/buildings"
import { BuildingDetail } from "../shared/BuildingDetail"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface SidebarProps {
  selectedBuilding: BuildingWithCoordinates | null
  searchText: string
  selectedTag: string | null
  availableTags: string[]
  onSearchTextChange: (value: string) => void
  onSelectedTagChange: (tag: string | null) => void
  isAddMode: boolean
  pendingCoords: { longitude: number; latitude: number} | null
  onStartAddMode:() => void
  onCancelAddMode: () => void
  isCreatingBuilding: boolean
  createBuildingError: string | null
  onSubmitCreateBuilding: (values: {
    title: string
    description: string
    tagText: string
  }) => void
}


export function Sidebar({
  selectedBuilding,
  searchText,
  selectedTag,
  availableTags,
  onSearchTextChange,
  onSelectedTagChange,
  isAddMode,
  pendingCoords,
  onStartAddMode,
  onCancelAddMode,
  isCreatingBuilding,
  createBuildingError,
  onSubmitCreateBuilding
  
}: SidebarProps) {
  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newTagsText, setNewTagsText] = useState("")

  const handleSubmitCreate = () => {
  onSubmitCreateBuilding({
    title: newTitle,
    description: newDescription,
    tagText: newTagsText,
  })
}
    return (
    <aside className="w-80 border-r bg-card h-screen flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">UVA History Map</h2>
        <p className="text-sm text-muted-foreground">
          Explore historical buildings
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-2">
            <h3 className="text-sm font-medium">Building Details</h3>
            <Card className="p-4 space-y-2">
              <BuildingDetail 
                building={selectedBuilding} 
                emptyMessage="Click a marker to see details"
              />
            </Card>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Filters</h3>

            <Input
              placeholder="Search buildings..."
              value={searchText}
              onChange={(e) => onSearchTextChange(e.target.value)}
            />

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant={selectedTag === null ? "default" : "outline"}
                onClick={() => onSelectedTagChange(null)}
              >
                All
              </Button>

              {availableTags.map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  size="sm"
                  variant={selectedTag === tag ? "default" : "outline"}
                  onClick={() => onSelectedTagChange(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-sm font-medium"> Add Building</h3>
        <Card className="p-3 space-y-3">
          {!isAddMode ? (
            <Button type= "button" onClick={onStartAddMode} className="w-full">
              Start Add Mode
            </Button>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Click on the map to choose a location.
              </p>

              <div className="space-y-2">
                  <Input
                    placeholder="Building title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />

                  <textarea
                    className="w-full min-h-20 rounded-md border bg-background px-3 py-2 text-sm"
                    placeholder="Description (optional)"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />

                  <Input
                    placeholder="Tags (comma separated)"
                    value={newTagsText}
                    onChange={(e) => setNewTagsText(e.target.value)}
                  />
                </div>

                {createBuildingError && (
                  <p className="text-xs text-red-600">{createBuildingError}</p>
                )}

                <Button
                  type="button"
                  className="w-full"
                  disabled={isCreatingBuilding || !pendingCoords || newTitle.trim().length === 0}
                  onClick={handleSubmitCreate}
                >
                  {isCreatingBuilding ? "Creating..." : "Create Building"}
                </Button>

              <Button type="button" variant="outline" onClick={onCancelAddMode} className="w-full">
                Cancel Add Mode
              </Button>
            </>
          )
        }
        </Card>
      </div>
      <div className="p-4 border-t mt-auto">
        <form action={signOut}>
            <Button variant="outline" size="sm" className="w-full">
                 Sign Out
            </Button>
        </form>
      </div>
    </aside>
    )
}