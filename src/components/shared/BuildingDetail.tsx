import { BuildingWithCoordinates } from "@/actions/buildings"

interface BuildingDetailProps {
    building: BuildingWithCoordinates | null
    emptyMessage?: string
}

export function BuildingDetail({building, emptyMessage = "Click a marker to see details" }: BuildingDetailProps) {
    if (!building) {
        return (
            <p className = "text-sm text-muted-foreground">
                {emptyMessage}
            </p>
        )
    }

    return (
        <>
            <h4 className="font-semibold">{building.title}</h4>

            {building.description ? (
                <p className="text-sm text-muted-foreground">
                    {building.description}
                </p>
            ) : (
                <p className ="text-sm text-muted-foreground italic">
                    No Description yet.
                </p>
            )}

            {building.tags && building.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                    {building.tags.map((tag) => (
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
    )

}