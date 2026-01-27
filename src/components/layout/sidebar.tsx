import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"    

export function Sidebar() {
    return (
        <aside className="w-80 border-r bg-card h-screen overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">UVA History Map</h2>
        <p className="text-sm text-muted-foreground">
          Explore historical buildings
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Building Details</h3>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">
              Click on a marker to view details
            </p>
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
    </aside>
    )
}