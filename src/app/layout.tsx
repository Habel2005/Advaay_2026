import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import ClientLayout from "@/components/ui/ClientLayout"
import Footer from '@/components/ui/Footer'

/* ---------------- FONTS ---------------- */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

/* ---------------- METADATA ---------------- */

export const metadata: Metadata = {
  title: "ADVAY 2026 | National Level Techno-Cultural Fest",
  description:
    "ADVAY is the National-level Techno-Cultural fest of Toc H Institute of Science & Technology. February 14-15, 2026.",
  keywords: ["ADVAY", "ADVAY 2026", "TIST", "College Fest", "Kerala", "Techno Cultural"],
}

/* ---------------- VIEWPORT ---------------- */

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0D0D0D",
}

/* ---------------- ROOT LAYOUT ---------------- */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <ClientLayout>
          {children}
        </ClientLayout>
        <Footer />
      </body>
    </html>
  )
}
