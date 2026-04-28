import {
  buffetOfferSchema,
  dailyMealSchema,
  menuCategorySchema,
  menuItemSchema
} from '@/lib/menu-schema'
import { getPublicSupabaseClient } from '@/lib/supabase'

export async function fetchMenuData() {
  const supabase = getPublicSupabaseClient()

  const [categoriesRes, itemsRes, offersRes, mealsRes] = await Promise.all([
    supabase.from('menu_categories').select('*').order('order', { ascending: true }),
    supabase.from('menu_items').select('*').order('name_ar', { ascending: true }),
    supabase.from('buffet_offers').select('*').order('meters_count', { ascending: true }),
    supabase.from('daily_meals').select('*').order('title_ar', { ascending: true })
  ])

  if (categoriesRes.error) throw new Error(categoriesRes.error.message)
  if (itemsRes.error) throw new Error(itemsRes.error.message)
  if (offersRes.error) throw new Error(offersRes.error.message)
  if (mealsRes.error) throw new Error(mealsRes.error.message)

  const categories = menuCategorySchema.array().parse(categoriesRes.data || [])
  const items = menuItemSchema.array().parse(itemsRes.data || [])
  const buffetOffers = buffetOfferSchema.array().parse(offersRes.data || [])
  const dailyMeals = dailyMealSchema.array().parse(mealsRes.data || [])

  return { categories, items, buffetOffers, dailyMeals }
}
