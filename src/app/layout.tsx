import './globals.css'
import { Outfit } from 'next/font/google'
import Navbar from '@/components/Navbar'

const outfit = Outfit({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit'
})

export const metadata = {
  title: 'NS Hair Admin Dashboard',
  description: 'Admin dashboard for NS Global Hair Traders',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${outfit.className} font-outfit`}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="mobile-container">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
