/**
 * Zod Validation Schemas for Buildings
 * 
 * These schemas validate user input before sending to the database.
 * They provide type-safe parsing and helpful error messages.
 */

import { z } from 'zod'

/**
 * GeoJSON Point schema for PostGIS location fields
 * Format: { type: 'Point', coordinates: [longitude, latitude] }
 */
export const geoPointSchema = z.object({
  type: z.literal('Point'),
  coordinates: z.tuple([
    z.number().min(-180).max(180), // longitude
    z.number().min(-90).max(90),   // latitude
  ]),
})

/**
 * Schema for creating a new building
 * Used in admin forms when adding a building marker
 */
export const createBuildingSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .max(5000, 'Description must be less than 5000 characters')
    .optional()
    .nullable(),
  location: geoPointSchema,
  tags: z
    .array(z.string().min(1).max(50))
    .max(10, 'Maximum 10 tags allowed')
    .optional()
    .nullable(),
})

/**
 * Schema for updating an existing building
 * All fields are optional since updates can be partial
 */
export const updateBuildingSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .optional(),
  description: z
    .string()
    .max(5000, 'Description must be less than 5000 characters')
    .optional()
    .nullable(),
  location: geoPointSchema.optional(),
  tags: z
    .array(z.string().min(1).max(50))
    .max(10, 'Maximum 10 tags allowed')
    .optional()
    .nullable(),
})

/**
 * Schema for image uploads
 */
export const createImageSchema = z.object({
  building_id: z.number().int().positive(),
  url: z.string().url('Must be a valid URL'),
  caption: z
    .string()
    .max(500, 'Caption must be less than 500 characters')
    .optional()
    .nullable(),
})

// Type inference from schemas (TypeScript magic!)
export type CreateBuildingInput = z.infer<typeof createBuildingSchema>
export type UpdateBuildingInput = z.infer<typeof updateBuildingSchema>
export type CreateImageInput = z.infer<typeof createImageSchema>
