import { z } from 'zod'

export interface MenuCategory {
  id: string
  name_ar: string
  order: number
}

export interface MenuItem {
  id: string
  category_id: string
  name_ar: string
  description_ar: string | null
  price: number
  image_url: string | null
}

export interface BuffetOffer {
  id: string
  title_ar: string
  description_ar: string | null
  meters_count: number
  items_count: number
  persons_count: number
  pepsi_per_meter: number
  water_per_meter: number
  includes_dessert: boolean
  price: number
}

export interface DailyMeal {
  id: string
  title_ar: string
  description_ar: string | null
  price: number
  image_url: string | null
}

export const menuCategorySchema = z.object({
  id: z.string(),
  name_ar: z.string(),
  order: z.number()
})

export const menuItemSchema = z.object({
  id: z.string(),
  category_id: z.string(),
  name_ar: z.string(),
  description_ar: z.string().nullable(),
  price: z.number(),
  image_url: z.string().nullable()
})

export const buffetOfferSchema = z.object({
  id: z.string(),
  title_ar: z.string(),
  description_ar: z.string().nullable(),
  meters_count: z.number(),
  items_count: z.number(),
  persons_count: z.number().default(0),
  pepsi_per_meter: z.number(),
  water_per_meter: z.number(),
  includes_dessert: z.boolean(),
  price: z.number()
})

export const dailyMealSchema = z.object({
  id: z.string(),
  title_ar: z.string(),
  description_ar: z.string().nullable().default(null),
  price: z.number(),
  image_url: z.string().nullable().default(null)
})

export const menuCategoryInputSchema = z.object({
  name_ar: z.string().min(1),
  order: z.coerce.number().int().min(0)
})

export const menuCategoryUpdateSchema = menuCategoryInputSchema.partial().extend({
  id: z.string().min(1)
})

export const menuItemInputSchema = z.object({
  category_id: z.string().min(1),
  name_ar: z.string().min(1),
  description_ar: z.string().nullable().optional(),
  price: z.coerce.number().min(0),
  image_url: z.string().nullable().optional()
})

export const menuItemUpdateSchema = menuItemInputSchema.partial().extend({
  id: z.string().min(1)
})

export const buffetOfferInputSchema = z.object({
  title_ar: z.string().min(1),
  description_ar: z.string().nullable().optional(),
  meters_count: z.coerce.number().int().min(1),
  items_count: z.coerce.number().int().min(1),
  persons_count: z.coerce.number().int().min(0),
  pepsi_per_meter: z.coerce.number().int().min(0),
  water_per_meter: z.coerce.number().int().min(0),
  includes_dessert: z.boolean(),
  price: z.coerce.number().min(0)
})

export const buffetOfferUpdateSchema = buffetOfferInputSchema.partial().extend({
  id: z.string().min(1)
})

export const dailyMealInputSchema = z.object({
  title_ar: z.string().min(1),
  description_ar: z.string().nullable().optional(),
  price: z.coerce.number().min(0),
  image_url: z.string().nullable().optional()
})

export const dailyMealUpdateSchema = dailyMealInputSchema.partial().extend({
  id: z.string().min(1)
})
