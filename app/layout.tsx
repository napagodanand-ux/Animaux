import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Animaux — Discover the Science Behind Pet Happiness',
  description:
    'Join thousands of pet owners contributing to groundbreaking research on human-pet relationships, emotional bonds, and the science of pet happiness.',
  keywords: ['pet research', 'pet happiness', 'human-pet bond', 'pet owner survey', 'animal welfare'],
  openGraph: {
    title: 'Animaux — Discover the Science Behind Pet Happiness',
    description: 'Contribute to groundbreaking pet-owner research.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={inter.variable}
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
