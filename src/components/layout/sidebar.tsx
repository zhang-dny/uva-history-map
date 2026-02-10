import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"    
import { signOut } from "@/actions/auth"
import type { BuildingWithCoordinates } from "@/actions/buildings"

interface SidebarProps{
  selectedBuilding: BuildingWithCoordinates | null
}

export function Sidebar({ selectedBuilding }: SidebarProps) {
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
            {!selectedBuilding ? (
              <p className="text-sm text-muted-foreground">
                CLick marker to see detail
              </p>
            ) : (
              <>
                <h4 className="font-semibold">{selectedBuilding.title}</h4>
                {selectedBuilding.description ? (
                  <p className="text-sm text-muted-foreground">{selectedBuilding.description}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No description yet.</p>
                )}
                {selectedBuilding.tags && selectedBuilding.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {selectedBuilding.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
          </Card>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Filters</h3>
          <div className="space-y-1">
            <Button variant="outline" size="sm" className="w-full justify-start">
              All Buildings
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              Historic Landmarks
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              Academic Buildings
            </Button>
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