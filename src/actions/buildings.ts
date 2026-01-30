'use server'

import { createClient } from '@/lib/supabase/server'
import type { Building } from '@/types/database'

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

  // @ts-expect-error - Custom RPC function not in generated types
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