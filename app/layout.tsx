import './globals.css'
import { LanguageProvider } from './providers/language-provider'
import Header from './components/Header'

export const metadata = {
  title: 'Yummi Go Platform',
  description: 'Demo bilingual Next.js app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <LanguageProvider>
          <Header />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
