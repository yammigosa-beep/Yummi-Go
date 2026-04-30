import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchMenuData } from '@/lib/menu-data'
import { formatSar } from '@/lib/menu-format'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'المنيو - Yummi Go',
  description: 'قائمة الطعام والعروض اليومية'
}

async function fetchMenuPageContent() {
  try {
    const requestHeaders = headers()
    const host = requestHeaders.get('host')
    const protocol = requestHeaders.get('x-forwarded-proto') || 'http'

    if (!host) return null

    const response = await fetch(`${protocol}://${host}/api/content`, { cache: 'no-store' })
    if (!response.ok) return null

    return response.json()
  } catch {
    return null
  }
}

export default async function MenuPage() {
  const [content, { categories, items, buffetOffers, dailyMeals }] = await Promise.all([
    fetchMenuPageContent(),
    fetchMenuData()
  ])
  const itemsByCategory = items.reduce<Record<string, typeof items>>((acc, item) => {
    acc[item.category_id] = acc[item.category_id] || []
    acc[item.category_id].push(item)
    return acc
  }, {})
  const menuPageCopy = content?.menu?.page || {}
  const buffetTitle = menuPageCopy.buffetOffers?.title?.ar || 'عروض البوفيه'
  const buffetDescription = menuPageCopy.buffetOffers?.description?.ar || 'خيارات بوفيه بالمتر تشمل السخانات والمشروبات والحلى.'
  const dailyMealsTitle = menuPageCopy.dailyMeals?.title?.ar || 'الوجبات اليومية'
  const dailyMealsDescription = menuPageCopy.dailyMeals?.description?.ar || 'وجبات جاهزة مع وصف مختصر وسعر واضح.'

  return (
    <>
      <WhatsAppFloat />
      <main dir="rtl" className="min-h-screen bg-bg-off-white font-cairo text-text-body">
      <section className="relative overflow-hidden bg-warm-section text-white">
        <div className="absolute inset-0">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-yummi-accent/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-yummi-primary/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-8 sm:py-14">
          <Badge variant="outline" className="border-white/40 text-white">
            منيو يمي قو
          </Badge>
          <h1 className="mt-3 text-3xl font-bold sm:mt-4 sm:text-4xl md:text-5xl">تجربة طعام أصيلة ومتكاملة</h1>
          <p className="mt-3 max-w-2xl text-base text-white/80 sm:mt-4 sm:text-lg">
            أصناف عربية مختارة بعناية، عروض بوفيه بالمتر، ووجبات يومية جاهزة لتخدم جميع احتياجاتك.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
            <Badge variant="secondary" className="bg-white/15 text-white">أصناف يومية</Badge>
            <Badge variant="secondary" className="bg-white/15 text-white">عروض بوفيه مرنة</Badge>
            <Badge variant="secondary" className="bg-white/15 text-white">وجبات سريعة التقديم</Badge>
          </div>
        </div>
      </section>

      <section className="bg-bg-off-white py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-center md:justify-between md:gap-4">
            <div>
              <h2 className="text-2xl font-bold text-text-dark-red sm:text-3xl">الأصناف</h2>
              <p className="text-text-body">اختيارات متنوعة من الأطباق العربية والمقبلات والحلويات.</p>
            </div>
            <Badge variant="outline">تشكيلة كاملة</Badge>
          </div>

          {categories.map((category) => {
            const categoryItems = itemsByCategory[category.id] || []
            
            return (
              <div key={category.id} className="mb-8 sm:mb-12">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-5 sm:gap-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-text-orange sm:text-2xl">{category.name_ar}</h3>
                    <Badge variant="secondary">{categoryItems.length} صنف</Badge>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 sm:gap-6">
                  {categoryItems.map((item) => (
                    <Card key={item.id} className="relative overflow-hidden">
                      {item.image_url ? (
                        <>
                          <Badge className="absolute left-4 top-4 z-10">{formatSar(item.price)}</Badge>
                          <div className="h-28 w-full bg-bg-light-gray sm:h-40">
                            <img
                              src={item.image_url}
                              alt={item.name_ar}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        </>
                      ) : (
                        <Badge className="absolute left-4 top-4 z-10">{formatSar(item.price)}</Badge>
                      )}
                      <CardContent className="space-y-1 px-4 py-4 sm:space-y-2 sm:px-6 sm:py-5">
                        <div>
                          <h4 className="text-base font-bold text-text-heading sm:text-lg">{item.name_ar}</h4>
                          {item.description_ar ? (
                            <p className="text-sm text-text-body">{item.description_ar}</p>
                          ) : null}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {categoryItems.length === 0 ? (
                    <Card className="border-dashed border-2 border-gray-200 bg-white/60">
                      <CardContent className="py-6 text-center text-text-body sm:py-10">لا توجد أصناف في هذا القسم حالياً</CardContent>
                    </Card>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="bg-bg-off-white py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-center md:justify-between md:gap-4">
            <div>
              <h2 className="text-2xl font-bold text-yummi-primary sm:text-3xl">{buffetTitle}</h2>
              <p className="text-text-body">{buffetDescription}</p>
            </div>
            <Badge variant="outline">عروض بالمتر</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {buffetOffers.map((offer) => (
              <Card key={offer.id} className="relative border-2 border-yummi-accent/20">
                <Badge className="absolute left-4 top-4 z-10">{formatSar(offer.price)}</Badge>
                <CardHeader className="px-4 pb-2 pt-4 sm:px-6 sm:pt-4">
                  <CardTitle className="text-lg sm:text-2xl">{offer.title_ar}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 px-4 py-4 sm:space-y-4 sm:px-6 sm:py-5">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{offer.meters_count} متر</Badge>
                    <Badge variant="secondary">{offer.items_count} سخان</Badge>
                    <Badge variant="secondary">{offer.persons_count} شخص</Badge>
                  </div>
                  {offer.description_ar ? (
                    <p className="text-sm leading-7 text-text-body">{offer.description_ar}</p>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bg-off-white py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-center md:justify-between md:gap-4">
            <div>
              <h2 className="text-2xl font-bold text-yummi-primary sm:text-3xl">{dailyMealsTitle}</h2>
              <p className="text-text-body">{dailyMealsDescription}</p>
            </div>
            <Badge variant="outline">تحديث مستمر</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {dailyMeals.map((meal) => (
              <Card key={meal.id} className="relative border-2 border-yummi-accent/20">
                <Badge className="absolute left-4 top-4 z-10">{formatSar(meal.price)}</Badge>
                <CardHeader className="px-4 pb-2 pt-4 sm:px-6 sm:pt-4">
                  <CardTitle className="text-lg sm:text-2xl">{meal.title_ar}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 px-4 py-4 sm:space-y-4 sm:px-6 sm:py-5">
                  {meal.description_ar ? (
                    <p className="text-sm leading-7 text-text-body">{meal.description_ar}</p>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      </main>
    </>
  )
}
