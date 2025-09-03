import '../globals.css'
import { LanguageProvider } from '../../providers/language-provider'

export const metadata = {
  title: 'Admin Panel - Yummi Go',
  description: 'Content Management System'
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Admin layout intentionally does not render the global Header from the root layout.
  // We still provide the LanguageProvider so translations/context work inside admin pages.
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  )
}
