import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  metadataBase: new URL('https://www.a2zplantnutrient.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  title: {
    template: "%s | A2Z Plant Nutrient",
    default: "A2Z Plant Nutrient | EPC Commercial Horticulture & Landscaping Partners",
  },
  description:
    "India's trusted EPC Partner for commercial horticulture, sustainable landscaping, and large-scale plantation projects. ISO 9001 & 14001 certified vendor for PSUs & Government.",
  keywords: [
    "EPC Horticulture",
    "Commercial Landscaping",
    "PSU Partners",
    "Government Tenders",
    "A2Z Plant Nutrient",
    "Urban Forestry",
    "Compensatory Afforestation",
  ],
  authors: [{ name: "A2Z Plant Nutrient" }],
  icons: { icon: "/logo.png" },
  openGraph: {
    title: "A2Z Plant Nutrient | EPC Commercial Horticulture & Landscaping",
    description:
      "India's trusted EPC Partner for commercial horticulture, sustainable landscaping, and large-scale plantation projects.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-stone-50 min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "A2Z Plant Nutrient",
              "image": "https://www.a2zplantnutrient.com/logo.png",
              "description": "India's trusted EPC Partner for commercial horticulture, sustainable landscaping, and large-scale plantation projects. ISO 9001 & 14001 certified vendor for PSUs & Government.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Varanasi",
                "addressRegion": "UP",
                "addressCountry": "IN"
              },
              "telephone": "+919451152065",
              "url": "https://www.a2zplantnutrient.com"
            })
          }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingActions />
        <Toaster />
      </body>
    </html>
  );
}
