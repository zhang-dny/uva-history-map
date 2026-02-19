'use server'

import { createClient } from '@/lib/supabase/server'
import type { Tables } from '@/types/database'
import { createBuildingSchema } from '@/lib/validations/building'
import type { CreateBuildingInput } from '@/lib/validations/building'
import { updateBuildingSchema } from '@/lib/validations/building'



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

type UpdateBuildingResult =
| { success: true; buildingId: number }
| { success: false; error: string }

export async function updateBuilding(
  id: number,
  input: { title: string; description: string | null; tags: string[] }
): Promise<UpdateBuildingResult> {
  const supabase = await createClient()

  if (!Number.isInteger(id) || id <= 0) {
    return { success: false, error: 'Invalid building id' }
  }

  const parsed = updateBuildingSchema.safeParse({
    title: input.title,
    description: input.description,
    tags: input.tags,
  })

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid building data',
    }
  }

  const title = input.title.trim()
  if (!title) {
    return { success: false, error: 'Title is required' }
  }

  const { data, error } = await supabase
    .from('buildings')
    .update({
      title,
      description: input.description ?? null,
      tags: input.tags,
    })
    .eq('id', id)
    .select('id')
    .single()

  if (error || !data) {
    console.error('error updating building:', error)
    return { success: false, error: 'Failed to update building' }
  }

  return { success: true, buildingId: data.id }
}


type DeleteBuildingResult = 
| {success: true; deletedID: number}
| {success: false; errorMessage: string}

export async function deleteBuilding(id: number): Promise<DeleteBuildingResult>  {
  const supabase = await createClient()
  if (!Number.isInteger(id) || id <= 0) {
    console.error('Invalid Building Id')
    return { success: false, errorMessage: 'Error deleting building, invalid id' }
  }

  const {data, error} = await supabase
    .from('buildings').delete().eq('id', id).select('id').single()

  if (error) {
    console.error('error deleting building:', error)
    return {success: false, errorMessage: 'error deleting building'}
  }
  return {success: true, deletedID: data.id}
}
