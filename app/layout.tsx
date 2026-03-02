import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Instrument_Serif } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: 'Squash Merge & Release Cycle — Git Workflow Docs',
  description: 'Documentación interactiva del workflow Squash Merge & Release Cycle. Sprint-based development con 3 branches (main, stg, dev), squash merges a producción y diagramas de git.',
  metadataBase: new URL('https://git-workflow-documentation.vercel.app'),
  openGraph: {
    title: 'Squash Merge & Release Cycle',
    description: 'Workflow basado en sprints con squash merges a main. 3 branches: main, stg y dev. Documentación interactiva con diagramas de git.',
    type: 'website',
    locale: 'es_LA',
    siteName: 'Git Workflow Docs',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Squash Merge & Release Cycle',
    description: 'Workflow basado en sprints con squash merges a main. Documentación interactiva con diagramas de git.',
  },
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased grain ${_instrumentSerif.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
