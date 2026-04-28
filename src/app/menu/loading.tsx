import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  const cards = Array.from({ length: 6 })

  return (
    <main dir="rtl" className="min-h-screen bg-bg-off-white font-cairo text-text-body">
      <section className="bg-warm-section text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 space-y-4">
          <Skeleton className="h-6 w-32 bg-white/20" />
          <Skeleton className="h-10 w-72 bg-white/20" />
          <Skeleton className="h-4 w-96 bg-white/20" />
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="bg-white/10 text-white">&nbsp;</Badge>
            <Badge variant="secondary" className="bg-white/10 text-white">&nbsp;</Badge>
            <Badge variant="secondary" className="bg-white/10 text-white">&nbsp;</Badge>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 space-y-6">
          <Skeleton className="h-8 w-40" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((_, index) => (
              <Card key={`menu-card-${index}`} className="overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <CardContent className="space-y-3 pt-4">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-6xl px-4 space-y-6">
          <Skeleton className="h-8 w-40" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cards.slice(0, 3).map((_, index) => (
              <Card key={`buffet-card-${index}`} className="space-y-4">
                <CardContent className="space-y-4">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-4 w-48" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 space-y-6">
          <Skeleton className="h-8 w-40" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((_, index) => (
              <Card key={`meal-card-${index}`} className="overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <CardContent className="space-y-3 pt-4">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-52" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
