import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"    
import { signOut } from "@/actions/auth"
import type { BuildingWithCoordinates } from "@/actions/buildings"
import { BuildingDetail } from "../shared/BuildingDetail"
import { Input } from "@/components/ui/input"

interface SidebarProps {
  selectedBuilding: BuildingWithCoordinates | null
  searchText: string
  selectedTag: string | null
  availableTags: string[]
  onSearchTextChange: (value: string) => void
  onSelectedTagChange: (tag: string | null) => void
}


export function Sidebar({
  selectedBuilding,
  searchText,
  selectedTag,
  availableTags,
  onSearchTextChange,
  onSelectedTagChange,
}: SidebarProps) {
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