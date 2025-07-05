import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { SettingsProvider } from "@/lib/context/SettingsContext"
import { ThemeToggle } from "@/components/theme-toggle"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Personal Finance Visualizer",
  description: "Manage your finances like a todo list",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SettingsProvider>
            {children}
            <Toaster />
            <ThemeToggle />
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
