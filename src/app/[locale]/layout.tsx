import "../globals.css";
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import Navbar from '@/shared/ui/Navbar';
import Footer from '@/shared/ui/Footer';
import { Metadata } from 'next';
import { generateMetadata as generateSiteMetadata } from './metadata';

// Generador de metadatos dinámicos
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return generateSiteMetadata(params.locale);
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} dir="ltr">
      <head>
        <link rel="icon" href="/LogoAunClic.svg" sizes="any" />
        <link rel="apple-touch-icon" href="/LogoAunClic.svg" />
        <link rel="manifest" href="/LogoAunClic.svg" />
        
        {/* Preconectar a dominios importantes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Fuentes optimizadas */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" 
          rel="stylesheet"
        />
        
        {/* Etiquetas de localización para Canadá */}
        <meta name="geo.region" content="CA" />
        <meta name="geo.placename" content="Canada" />
        <meta property="og:country-name" content="Canada" />
        
        {/* Etiquetas de verificación de propiedad */}
        <meta name="google-site-verification" content="google-site-verification-code" />
        
        {/* Etiquetas para SEO local */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "A un Clic la",
              "url": "https://aunclicla.ca",
              "logo": "https://aunclicla.ca/LogoAunClic.svg",
              "sameAs": [
                "https://facebook.com/aunclicla",
                "https://instagram.com/aunclicla",
                "https://twitter.com/aunclicla"
              ],
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "123 Latin Market Street",
                "addressLocality": "Toronto",
                "addressRegion": "ON",
                "postalCode": "M5V 2L7",
                "addressCountry": "CA"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-416-555-0123",
                "contactType": "customer service",
                "availableLanguage": ["English", "Spanish", "French"]
              }
            })
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <NextIntlClientProvider>
          <header>
            <Navbar />
          </header>
          <main className="pt-16 flex-grow bg-white">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
        
        {/* Script de Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `
          }}
        />
      </body>
    </html>
  );
}