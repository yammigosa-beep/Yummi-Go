"use client"

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { z } from 'zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import {
  BuffetOffer,
  DailyMeal,
  MenuCategory,
  MenuItem,
  buffetOfferSchema,
  dailyMealSchema,
  menuCategorySchema,
  menuItemSchema
} from '@/lib/menu-schema'
import { formatSar } from '@/lib/menu-format'

const categoryFormInitial = { id: '', name_ar: '', order: '' }
const itemFormInitial = { id: '', category_id: '', name_ar: '', description_ar: '', price: '', image_url: '' }
const buffetFormInitial = {
  id: '',
  title_ar: '',
  meters_count: '',
  items_count: '',
  pepsi_per_meter: '',
  water_per_meter: '',
  includes_dessert: true,
  price: ''
}
const dailyMealFormInitial = { id: '', title_ar: '', description_ar: '', price: '', image_url: '' }

async function fetchResource<T>(resource: string, schema: z.ZodTypeAny): Promise<T> {
  const res = await fetch(`/api/menu/${resource}`, { cache: 'no-store' })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'حدث خطأ أثناء التحميل')
  return schema.parse(json.data || [])
}

export default function AdminMenuClient() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [adminApiKey, setAdminApiKey] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState(false)

  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const [buffetOffers, setBuffetOffers] = useState<BuffetOffer[]>([])
  const [dailyMeals, setDailyMeals] = useState<DailyMeal[]>([])

  const [categoryForm, setCategoryForm] = useState(categoryFormInitial)
  const [itemForm, setItemForm] = useState(itemFormInitial)
  const [buffetForm, setBuffetForm] = useState(buffetFormInitial)
  const [dailyMealForm, setDailyMealForm] = useState(dailyMealFormInitial)

  const categoriesById = useMemo(() => {
    return Object.fromEntries(categories.map((category) => [category.id, category]))
  }, [categories])

  useEffect(() => {
    const storedKey = typeof window !== 'undefined' ? localStorage.getItem('admin_api_key') : null
    if (storedKey) {
      setAdminApiKey(storedKey)
      setLoggedIn(true)
      void loadAll()
    }
  }, [])

  async function loadAll() {
    setLoading(true)
    setStatus('')
    try {
      const [loadedCategories, loadedItems, loadedOffers, loadedMeals] = await Promise.all([
        fetchResource<MenuCategory[]>('categories', menuCategorySchema.array()),
        fetchResource<MenuItem[]>('items', menuItemSchema.array()),
        fetchResource<BuffetOffer[]>('buffet-offers', buffetOfferSchema.array()),
        fetchResource<DailyMeal[]>('daily-meals', dailyMealSchema.array())
      ])
      setCategories(loadedCategories)
      setItems(loadedItems)
      setBuffetOffers(loadedOffers)
      setDailyMeals(loadedMeals)
    } catch (error: any) {
      setStatus(error.message || 'تعذر تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }

  async function login(e: FormEvent) {
    e.preventDefault()
    setStatus('')
    setBusy(true)
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'فشل تسجيل الدخول')
      const apiKey = json.apiKey as string
      setAdminApiKey(apiKey)
      setLoggedIn(true)
      localStorage.setItem('admin_api_key', apiKey)
      setPassword('')
      await loadAll()
    } catch (error: any) {
      setStatus(error.message || 'فشل تسجيل الدخول')
    } finally {
      setBusy(false)
    }
  }

  function logout() {
    setLoggedIn(false)
    setAdminApiKey('')
    localStorage.removeItem('admin_api_key')
  }

  async function mutate(resource: string, method: string, body: any) {
    if (!adminApiKey) throw new Error('غير مصرح')
    const res = await fetch(`/api/menu/${resource}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminApiKey
      },
      body: JSON.stringify(body)
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'تعذر حفظ البيانات')
    return json
  }

  async function saveCategory(e: FormEvent) {
    e.preventDefault()
    setStatus('')
    const name = categoryForm.name_ar.trim()
    const order = Number(categoryForm.order)
    if (!name) return setStatus('يرجى إدخال اسم القسم')
    if (Number.isNaN(order)) return setStatus('يرجى إدخال ترتيب صحيح')
    setBusy(true)
    try {
      const payload = { name_ar: name, order }
      if (categoryForm.id) {
        await mutate('categories', 'PUT', { id: categoryForm.id, ...payload })
      } else {
        await mutate('categories', 'POST', payload)
      }
      setCategoryForm(categoryFormInitial)
      await loadAll()
    } catch (error: any) {
      setStatus(error.message || 'تعذر حفظ القسم')
    } finally {
      setBusy(false)
    }
  }

  async function saveItem(e: FormEvent) {
    e.preventDefault()
    setStatus('')
    const name = itemForm.name_ar.trim()
    const price = Number(itemForm.price)
    if (!itemForm.category_id) return setStatus('يرجى اختيار القسم')
    if (!name) return setStatus('يرجى إدخال اسم الصنف')
    if (Number.isNaN(price)) return setStatus('يرجى إدخال سعر صحيح')
    setBusy(true)
    try {
      const payload = {
        category_id: itemForm.category_id,
        name_ar: name,
        description_ar: itemForm.description_ar.trim() || null,
        price,
        image_url: itemForm.image_url.trim() || null
      }
      if (itemForm.id) {
        await mutate('items', 'PUT', { id: itemForm.id, ...payload })
      } else {
        await mutate('items', 'POST', payload)
      }
      setItemForm(itemFormInitial)
      await loadAll()
    } catch (error: any) {
      setStatus(error.message || 'تعذر حفظ الصنف')
    } finally {
      setBusy(false)
    }
  }

  async function saveBuffetOffer(e: FormEvent) {
    e.preventDefault()
    setStatus('')
    const title = buffetForm.title_ar.trim()
    const meters = Number(buffetForm.meters_count)
    const itemsCount = Number(buffetForm.items_count)
    const pepsi = Number(buffetForm.pepsi_per_meter)
    const water = Number(buffetForm.water_per_meter)
    const price = Number(buffetForm.price)
    if (!title) return setStatus('يرجى إدخال عنوان العرض')
    if ([meters, itemsCount, pepsi, water, price].some((value) => Number.isNaN(value))) {
      return setStatus('يرجى إدخال أرقام صحيحة')
    }
    setBusy(true)
    try {
      const payload = {
        title_ar: title,
        meters_count: meters,
        items_count: itemsCount,
        pepsi_per_meter: pepsi,
        water_per_meter: water,
        includes_dessert: buffetForm.includes_dessert,
        price
      }
      if (buffetForm.id) {
        await mutate('buffet-offers', 'PUT', { id: buffetForm.id, ...payload })
      } else {
        await mutate('buffet-offers', 'POST', payload)
      }
      setBuffetForm(buffetFormInitial)
      await loadAll()
    } catch (error: any) {
      setStatus(error.message || 'تعذر حفظ العرض')
    } finally {
      setBusy(false)
    }
  }

  async function saveDailyMeal(e: FormEvent) {
    e.preventDefault()
    setStatus('')
    const title = dailyMealForm.title_ar.trim()
    const desc = dailyMealForm.description_ar.trim()
    const price = Number(dailyMealForm.price)
    if (!title) return setStatus('يرجى إدخال عنوان الوجبة')
    if (!desc) return setStatus('يرجى إدخال وصف الوجبة')
    if (Number.isNaN(price)) return setStatus('يرجى إدخال سعر صحيح')
    setBusy(true)
    try {
      const payload = {
        title_ar: title,
        description_ar: desc,
        price,
        image_url: dailyMealForm.image_url.trim() || null
      }
      if (dailyMealForm.id) {
        await mutate('daily-meals', 'PUT', { id: dailyMealForm.id, ...payload })
      } else {
        await mutate('daily-meals', 'POST', payload)
      }
      setDailyMealForm(dailyMealFormInitial)
      await loadAll()
    } catch (error: any) {
      setStatus(error.message || 'تعذر حفظ الوجبة')
    } finally {
      setBusy(false)
    }
  }

  async function deleteItem(resource: string, id: string) {
    if (!confirm('هل أنت متأكد من الحذف؟')) return
    setBusy(true)
    try {
      await mutate(resource, 'DELETE', { id })
      await loadAll()
    } catch (error: any) {
      setStatus(error.message || 'تعذر الحذف')
    } finally {
      setBusy(false)
    }
  }

  if (!loggedIn) {
    return (
      <main dir="rtl" className="min-h-screen bg-bg-off-white font-cairo text-text-body flex items-center justify-center">
        <div className="mx-auto w-full max-w-lg px-4 py-10">
          <Card>
            <CardHeader>
              <CardTitle>تسجيل الدخول</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={login} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-password">كلمة المرور</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="أدخل كلمة مرور الإدارة"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? 'جاري الدخول...' : 'دخول'}
                </Button>
                {status ? <p className="text-sm text-red-600">{status}</p> : null}
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main dir="rtl" className="min-h-screen bg-bg-off-white font-cairo text-text-body">
      <div className="mx-auto w-full max-w-7xl px-4 py-10">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-text-heading">إدارة المنيو</h1>
            <p className="mt-2 text-text-body">تحكم كامل في الأقسام والأصناف والعروض اليومية.</p>
          </div>
          <Badge variant="outline">لوحة التحكم</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">الأقسام</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-3xl font-bold text-text-heading">{categories.length}</span>
              <Badge variant="secondary">قسم</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">الأصناف</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-3xl font-bold text-text-heading">{items.length}</span>
              <Badge variant="secondary">صنف</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">عروض البوفيه</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-3xl font-bold text-text-heading">{buffetOffers.length}</span>
              <Badge variant="secondary">عرض</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">الوجبات اليومية</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-3xl font-bold text-text-heading">{dailyMeals.length}</span>
              <Badge variant="secondary">وجبة</Badge>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Badge variant="success">متصل</Badge>
              <span className="text-sm text-text-body">تم تسجيل الدخول بنجاح</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={loadAll} disabled={loading || busy}>
                تحديث البيانات
              </Button>
              <Button variant="ghost" onClick={logout}>
                تسجيل الخروج
              </Button>
            </div>
          </div>

      {status ? <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{status}</div> : null}

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <CardTitle>الأقسام</CardTitle>
          <Badge variant="secondary">{categories.length} قسم</Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={saveCategory} className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>اسم القسم</Label>
              <Input
                value={categoryForm.name_ar}
                onChange={(event) => setCategoryForm({ ...categoryForm, name_ar: event.target.value })}
                placeholder="المقبلات"
              />
            </div>
            <div className="space-y-2">
              <Label>الترتيب</Label>
              <Input
                type="number"
                value={categoryForm.order}
                onChange={(event) => setCategoryForm({ ...categoryForm, order: event.target.value })}
                placeholder="1"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit" disabled={busy}>
                {categoryForm.id ? 'تحديث القسم' : 'إضافة قسم'}
              </Button>
              {categoryForm.id ? (
                <Button type="button" variant="ghost" onClick={() => setCategoryForm(categoryFormInitial)}>
                  إلغاء
                </Button>
              ) : null}
            </div>
          </form>

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>القسم</TableHead>
                    <TableHead>الترتيب</TableHead>
                    <TableHead>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-semibold">{category.name_ar}</TableCell>
                      <TableCell>{category.order}</TableCell>
                      <TableCell className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setCategoryForm({
                              id: category.id,
                              name_ar: category.name_ar,
                              order: String(category.order)
                            })
                          }
                        >
                          تعديل
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteItem('categories', category.id)}>
                          حذف
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <CardTitle>الأصناف</CardTitle>
          <Badge variant="secondary">{items.length} صنف</Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={saveItem} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>القسم</Label>
              <Select
                value={itemForm.category_id}
                onChange={(event) => setItemForm({ ...itemForm, category_id: event.target.value })}
              >
                <option value="">اختر القسم</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name_ar}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>اسم الصنف</Label>
              <Input
                value={itemForm.name_ar}
                onChange={(event) => setItemForm({ ...itemForm, name_ar: event.target.value })}
                placeholder="حمص بالطحينه"
              />
            </div>
            <div className="space-y-2">
              <Label>السعر</Label>
              <Input
                type="number"
                value={itemForm.price}
                onChange={(event) => setItemForm({ ...itemForm, price: event.target.value })}
                placeholder="15"
              />
            </div>
            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <Label>الوصف</Label>
              <Textarea
                value={itemForm.description_ar}
                onChange={(event) => setItemForm({ ...itemForm, description_ar: event.target.value })}
                placeholder="وصف مختصر للصنف"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>رابط الصورة</Label>
              <Input
                value={itemForm.image_url}
                onChange={(event) => setItemForm({ ...itemForm, image_url: event.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit" disabled={busy}>
                {itemForm.id ? 'تحديث الصنف' : 'إضافة صنف'}
              </Button>
              {itemForm.id ? (
                <Button type="button" variant="ghost" onClick={() => setItemForm(itemFormInitial)}>
                  إلغاء
                </Button>
              ) : null}
            </div>
          </form>

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الصنف</TableHead>
                    <TableHead>القسم</TableHead>
                    <TableHead>السعر</TableHead>
                    <TableHead>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-semibold">{item.name_ar}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{categoriesById[item.category_id]?.name_ar || 'غير محدد'}</Badge>
                      </TableCell>
                      <TableCell>{formatSar(item.price)}</TableCell>
                      <TableCell className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setItemForm({
                              id: item.id,
                              category_id: item.category_id,
                              name_ar: item.name_ar,
                              description_ar: item.description_ar || '',
                              price: String(item.price),
                              image_url: item.image_url || ''
                            })
                          }
                        >
                          تعديل
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteItem('items', item.id)}>
                          حذف
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <CardTitle>عروض البوفيه</CardTitle>
          <Badge variant="secondary">{buffetOffers.length} عرض</Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={saveBuffetOffer} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2 lg:col-span-2">
              <Label>عنوان العرض</Label>
              <Input
                value={buffetForm.title_ar}
                onChange={(event) => setBuffetForm({ ...buffetForm, title_ar: event.target.value })}
                placeholder="العرض الأول"
              />
            </div>
            <div className="space-y-2">
              <Label>عدد الأمتار</Label>
              <Input
                type="number"
                value={buffetForm.meters_count}
                onChange={(event) => setBuffetForm({ ...buffetForm, meters_count: event.target.value })}
                placeholder="10"
              />
            </div>
            <div className="space-y-2">
              <Label>عدد السخانات</Label>
              <Input
                type="number"
                value={buffetForm.items_count}
                onChange={(event) => setBuffetForm({ ...buffetForm, items_count: event.target.value })}
                placeholder="10"
              />
            </div>
            <div className="space-y-2">
              <Label>بيبسي لكل متر</Label>
              <Input
                type="number"
                value={buffetForm.pepsi_per_meter}
                onChange={(event) => setBuffetForm({ ...buffetForm, pepsi_per_meter: event.target.value })}
                placeholder="10"
              />
            </div>
            <div className="space-y-2">
              <Label>ماء لكل متر</Label>
              <Input
                type="number"
                value={buffetForm.water_per_meter}
                onChange={(event) => setBuffetForm({ ...buffetForm, water_per_meter: event.target.value })}
                placeholder="10"
              />
            </div>
            <div className="space-y-2">
              <Label>السعر</Label>
              <Input
                type="number"
                value={buffetForm.price}
                onChange={(event) => setBuffetForm({ ...buffetForm, price: event.target.value })}
                placeholder="2500"
              />
            </div>
            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-text-dark">
                <input
                  type="checkbox"
                  checked={buffetForm.includes_dessert}
                  onChange={(event) => setBuffetForm({ ...buffetForm, includes_dessert: event.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-yummi-accent focus:ring-yummi-accent"
                />
                يشمل حلى
              </label>
            </div>
            <div className="flex items-end gap-2 lg:col-span-4">
              <Button type="submit" disabled={busy}>
                {buffetForm.id ? 'تحديث العرض' : 'إضافة عرض'}
              </Button>
              {buffetForm.id ? (
                <Button type="button" variant="ghost" onClick={() => setBuffetForm(buffetFormInitial)}>
                  إلغاء
                </Button>
              ) : null}
            </div>
          </form>

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>العرض</TableHead>
                    <TableHead>الأمتار</TableHead>
                    <TableHead>السخانات</TableHead>
                    <TableHead>السعر</TableHead>
                    <TableHead>الحلى</TableHead>
                    <TableHead>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buffetOffers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell className="font-semibold">{offer.title_ar}</TableCell>
                      <TableCell>{offer.meters_count}</TableCell>
                      <TableCell>{offer.items_count}</TableCell>
                      <TableCell>{formatSar(offer.price)}</TableCell>
                      <TableCell>
                        {offer.includes_dessert ? (
                          <Badge variant="success">يشمل</Badge>
                        ) : (
                          <Badge variant="warning">بدون</Badge>
                        )}
                      </TableCell>
                      <TableCell className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setBuffetForm({
                              id: offer.id,
                              title_ar: offer.title_ar,
                              meters_count: String(offer.meters_count),
                              items_count: String(offer.items_count),
                              pepsi_per_meter: String(offer.pepsi_per_meter),
                              water_per_meter: String(offer.water_per_meter),
                              includes_dessert: offer.includes_dessert,
                              price: String(offer.price)
                            })
                          }
                        >
                          تعديل
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteItem('buffet-offers', offer.id)}>
                          حذف
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <CardTitle>الوجبات اليومية</CardTitle>
          <Badge variant="secondary">{dailyMeals.length} وجبة</Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={saveDailyMeal} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>عنوان الوجبة</Label>
              <Input
                value={dailyMealForm.title_ar}
                onChange={(event) => setDailyMealForm({ ...dailyMealForm, title_ar: event.target.value })}
                placeholder="وجبة اليوم"
              />
            </div>
            <div className="space-y-2">
              <Label>السعر</Label>
              <Input
                type="number"
                value={dailyMealForm.price}
                onChange={(event) => setDailyMealForm({ ...dailyMealForm, price: event.target.value })}
                placeholder="25"
              />
            </div>
            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <Label>الوصف</Label>
              <Textarea
                value={dailyMealForm.description_ar}
                onChange={(event) => setDailyMealForm({ ...dailyMealForm, description_ar: event.target.value })}
                placeholder="نص حبة دجاج وبيبسي ومويا"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>رابط الصورة</Label>
              <Input
                value={dailyMealForm.image_url}
                onChange={(event) => setDailyMealForm({ ...dailyMealForm, image_url: event.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit" disabled={busy}>
                {dailyMealForm.id ? 'تحديث الوجبة' : 'إضافة وجبة'}
              </Button>
              {dailyMealForm.id ? (
                <Button type="button" variant="ghost" onClick={() => setDailyMealForm(dailyMealFormInitial)}>
                  إلغاء
                </Button>
              ) : null}
            </div>
          </form>

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الوجبة</TableHead>
                    <TableHead>السعر</TableHead>
                    <TableHead>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyMeals.map((meal) => (
                    <TableRow key={meal.id}>
                      <TableCell className="font-semibold">{meal.title_ar}</TableCell>
                      <TableCell>{formatSar(meal.price)}</TableCell>
                      <TableCell className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setDailyMealForm({
                              id: meal.id,
                              title_ar: meal.title_ar,
                              description_ar: meal.description_ar,
                              price: String(meal.price),
                              image_url: meal.image_url || ''
                            })
                          }
                        >
                          تعديل
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteItem('daily-meals', meal.id)}>
                          حذف
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
        </div>
      </div>
    </main>
  )
}
