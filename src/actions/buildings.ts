'use server'

import { createClient } from '@/lib/supabase/server'
import type { Tables } from '@/types/database'
import { createBuildingSchema } from '@/lib/validations/building'
import type { CreateBuildingInput } from '@/lib/validations/building'

type Building = Tables<'buildings'>

/**
 * Extended Building type with parsed coordinates
 */
export interface BuildingWithCoordinates extends Omit<Building, 'location'> {
  longitude: number
  latitude: number
}

/**
 * Fetch all buildings from the database
 * Converts PostGIS geography to lat/lng coordinates
 */
export async function getBuildings(): Promise<BuildingWithCoordinates[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('get_buildings_with_coordinates') as {
    data: BuildingWithCoordinates[] | null
    error: Error | null  // ← Changed from 'any'
  }
  
  if (error) {
    console.error('Error fetching buildings:', error)
    throw new Error('Failed to fetch buildings')
  }

  return data || []
}

/**
 * Get a single building by ID
 */
export async function getBuilding(id: number): Promise<BuildingWithCoordinates | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('get_building_by_id', { 
    building_id: id 
  }) as {
    data: BuildingWithCoordinates[] | null
    error: Error | null  // ← Changed from 'any'
  }
  
  if (error || !data || data.length === 0) {
    return null
  }

  return data[0]
}


type CreateBuildingResult = 
| { success: true; buildingId: number }
| { success: false; error: string }

export async function createBuilding(input: CreateBuildingInput): Promise<CreateBuildingResult> {
  const supabase = await createClient()

  const parsed = createBuildingSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false, 
      error: parsed.error.issues[0]?.message ?? 'Invalid building data',
    }
  }

  const {title, description, tags, location} = parsed.data
  const [longitude, latitude] = location.coordinates

  const geographyPoint = `SRID=4326;POINT(${longitude} ${latitude})`

  const { data, error } = await supabase
    .from('buildings')
    .insert({
      title,
      description: description ?? null,
      tags: tags ?? [],
      location: geographyPoint as unknown,
    })
    .select('id')
    .single()

  const insertedRow = data as { id: number } | null
    
  if (error || !insertedRow) {
    console.error('error creating building:', error)
    return { success: false, error: 'Failed to create building'}
  }

  return { success: true, buildingId: insertedRow.id}

}