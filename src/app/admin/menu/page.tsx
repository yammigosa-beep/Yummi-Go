import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAdminSupabaseClient } from '@/lib/supabase'
import dynamic from 'next/dynamic';
import AdminMenuClient from './AdminMenuClient'

export const metadata = {
  title: 'إدارة المنيو - Yummi Go',
  description: 'لوحة إدارة المنيو والعروض'
}


const AdminMenuClient = dynamic(() => import('./AdminMenuClient'), { ssr: false });

function AdminMenuProtected() {
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const adminKey = localStorage.getItem('admin_api_key');
      if (!adminKey) {
        window.location.href = '/admin';
      }
    }
  }, []);

  return (
    <main dir="rtl" className="min-h-screen bg-bg-off-white font-cairo text-text-body flex items-center justify-center">
      <div className="mx-auto max-w-7xl px-4 py-10 w-full">
        <AdminMenuClient />
      </div>
    </main>
  );
}

export default AdminMenuProtected;
  return (
    <main dir="rtl" className="min-h-screen bg-bg-off-white font-cairo text-text-body">
      <div className="mx-auto max-w-7xl px-4 py-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-text-heading">إدارة المنيو</h1>
            <p className="mt-2 text-text-body">تحكم كامل في الأقسام والأصناف والعروض اليومية.</p>
          </div>
          <Badge variant="outline">لوحة التحكم</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">الأقسام</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-3xl font-bold text-text-heading">{counts.categories}</span>
              <Badge variant="secondary">قسم</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">الأصناف</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-3xl font-bold text-text-heading">{counts.items}</span>
              <Badge variant="secondary">صنف</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">عروض البوفيه</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-3xl font-bold text-text-heading">{counts.offers}</span>
              <Badge variant="secondary">عرض</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">الوجبات اليومية</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-3xl font-bold text-text-heading">{counts.meals}</span>
              <Badge variant="secondary">وجبة</Badge>
            </CardContent>
          </Card>
        </div>

        <AdminMenuClient />
      </div>
    </main>
  )
}
