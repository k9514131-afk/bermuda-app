import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { MantineProvider } from '@mantine/core';
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';
import { PortalProvider } from '@/components/portal-provider';
import { Footer } from '@/components/shared/footer';
import { Toaster } from '@/components/ui/toaster';

const ibmSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-ibm-sans',
});

const ibmSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-ibm-sans-arabic',
});

/**
 * @fileOverview الهيكل الرئيسي للموقع - تم تحرير الاتجاه واللغة ليعملا ديناميكياً.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${ibmSans.variable} ${ibmSansArabic.variable}`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="font-body antialiased selection:bg-primary/30 min-h-screen">
        <PortalProvider>
          {children}
          <Footer />
          <Toaster />
        </PortalProvider>
      </body>
    </html>
  );
}
