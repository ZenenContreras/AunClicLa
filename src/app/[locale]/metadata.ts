import { Metadata } from 'next';

// Función para generar metadatos base
export function generateMetadata(locale: string): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aunclicla.ca';
  
  const languages = {
    en: {
      title: 'A un Clic la | Authentic Latin American Products in Canada',
      description: 'Discover authentic Latin American products, foods, and boutique items delivered to your door across Canada. Connect with the flavors and culture of the Americas.',
      keywords: 'Latin American products, Hispanic food Canada, Latin American grocery, authentic Mexican food, South American products, Latin American boutique, ethnic food delivery Canada',
    },
    es: {
      title: 'A un Clic la | Productos Auténticos Latinoamericanos en Canadá',
      description: 'Descubre productos auténticos latinoamericanos, comidas y artículos de boutique con entrega a domicilio en todo Canadá. Conéctate con los sabores y la cultura de las Américas.',
      keywords: 'productos latinoamericanos, comida hispana Canadá, abarrotes latinos, comida mexicana auténtica, productos sudamericanos, boutique latinoamericana, entrega de comida étnica Canadá',
    },
    fr: {
      title: 'A un Clic la | Produits Authentiques Latino-Américains au Canada',
      description: 'Découvrez des produits authentiques latino-américains, des aliments et des articles de boutique livrés à votre porte partout au Canada. Connectez-vous avec les saveurs et la culture des Amériques.',
      keywords: 'produits latino-américains, nourriture hispanique Canada, épicerie latino-américaine, nourriture mexicaine authentique, produits sud-américains, boutique latino-américaine, livraison de nourriture ethnique Canada',
    }
  };

  const content = languages[locale as keyof typeof languages] || languages.en;

  return {
    metadataBase: new URL(baseUrl),
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    applicationName: 'A un Clic la',
    authors: [{ name: 'A un Clic la', url: baseUrl }],
    creator: 'A un Clic la',
    publisher: 'A un Clic la Inc.',
    formatDetection: {
      telephone: true,
      date: true,
      address: true,
      email: true,
      url: true,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'en': `${baseUrl}/en`,
        'es': `${baseUrl}/es`,
        'fr': `${baseUrl}/fr`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale,
      url: `${baseUrl}/${locale}`,
      title: content.title,
      description: content.description,
      siteName: 'A un Clic la',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'A un Clic la - Latin American Products in Canada',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description: content.description,
      images: [`${baseUrl}/twitter-image.jpg`],
      creator: '@aunclicla',
      site: '@aunclicla',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'google-site-verification-code',
      yandex: 'yandex-verification-code',
    },
    category: 'ecommerce',
    classification: 'Latin American Products, Food, Boutique',
    other: {
      'geo.region': 'CA',
      'geo.placename': 'Canada',
      'og:country-name': 'Canada',
    },
  };
} 