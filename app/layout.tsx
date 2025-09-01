import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Task Manager - Stay Organized',
  description: 'A comprehensive task manager for work, personal life, and business',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#3b82f6',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Task Manager" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
