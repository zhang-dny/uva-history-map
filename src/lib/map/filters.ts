import type { BuildingWithCoordinates } from "@/actions/buildings"

export type BuildingFilterState = {
    searchText: string
    selectedTag: string | null
  }
  
  export function getAvailableTags(buildings: BuildingWithCoordinates[]): string[] {
    const allTags = buildings.flatMap((b) => b.tags ?? [])
    return Array.from(new Set(allTags)).sort((a, b) => a.localeCompare(b))
  }
  
  export function filterBuildings(
    buildings: BuildingWithCoordinates[],
    filters: BuildingFilterState
  ): BuildingWithCoordinates[] {
    const normalizedSearch = filters.searchText.trim().toLowerCase()
  
    return buildings.filter((b) => {
      const titleMatches =
        normalizedSearch.length === 0 ||
        b.title.toLowerCase().includes(normalizedSearch)
  
      const tagMatches =
        filters.selectedTag === null ||
        (b.tags ?? []).includes(filters.selectedTag)
  
      return titleMatches && tagMatches
    })
  }