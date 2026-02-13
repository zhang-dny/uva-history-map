import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"    
import { signOut } from "@/actions/auth"
import type { BuildingWithCoordinates } from "@/actions/buildings"
import { BuildingDetail } from "../shared/BuildingDetail"


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
              <BuildingDetail 
                building={selectedBuilding} 
                emptyMessage="Click a marker to see details"
              />
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