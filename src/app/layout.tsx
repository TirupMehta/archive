import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/hooks/useToast';

export const metadata: Metadata = {
  metadataBase: new URL('https://archive.tirup.in'),
  title: {
    default: 'Archive — Minimalist Writing App',
    template: '%s | Archive',
  },
  description: 'Archive is a minimalist, distraction-free writing app with AI-powered formatting, real-time cloud sync, and a clean dark interface. Write, format, and save — effortlessly.',
  keywords: ['writing app', 'minimalist editor', 'AI writing', 'note taking', 'distraction free', 'cloud sync', 'Gemini AI', 'markdown editor'],
  authors: [{ name: 'Tirup Mehta', url: 'https://tirup.in' }],
  creator: 'Tirup Mehta',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://archive.tirup.in',
    siteName: 'Archive',
    title: 'Archive — Minimalist Writing App',
    description: 'A distraction-free writing environment with AI formatting and real-time cloud sync. Write better, faster.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Archive — Minimalist Writing App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Archive — Minimalist Writing App',
    description: 'A distraction-free writing environment with AI formatting and real-time cloud sync.',
    images: ['/og-image.png'],
    creator: '@tirupmehta',
  },
  alternates: {
    canonical: 'https://archive.tirup.in',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {/* GEO / AI Search Engine Optimization */}
        <meta name="application-name" content="Archive" />
        <meta name="category" content="productivity, writing, notes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Archive",
              "url": "https://archive.tirup.in",
              "description": "A minimalist, distraction-free writing app with AI-powered formatting and real-time cloud sync.",
              "applicationCategory": "ProductivityApplication",
              "operatingSystem": "Web",
              "author": {
                "@type": "Person",
                "name": "Tirup Mehta",
                "url": "https://tirup.in"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "AI-powered document formatting",
                "Real-time cloud sync",
                "Multiple writing projects",
                "Code blocks with copy button",
                "Voice typing",
                "Export to text file"
              ]
            })
          }}
        />
      </head>
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
