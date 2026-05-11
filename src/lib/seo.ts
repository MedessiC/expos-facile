/**
 * Configuration SEO et métadonnées pour ExposéTché
 * Plateforme MIDEESSI - Commande d'exposés scolaires
 */

export const SEO_CONFIG = {
  site: {
    name: "ExposéTché",
    url: "https://exposetche.com",
    description: "Plateforme MIDEESSI : commande d'exposés scolaires de qualité, rédacteurs certifiés, livrables validés.",
    logo: "https://exposetche.com/logo.png",
    image: "https://exposetche.com/og-image.png",
  },
  social: {
    facebook: "https://www.facebook.com/mideessi",
    instagram: "https://www.instagram.com/mideessi",
    twitter: "https://www.twitter.com/mideessi",
  },
  organization: {
    name: "MIDEESSI",
    url: "https://mideessi.com",
    contactPoint: {
      telephone: "+229XXXXXXXX",
      contactType: "Customer Service",
    },
  },
  locales: ["fr-BJ", "fr-FR"],
};

export function generateOrgSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SEO_CONFIG.site.name,
    "url": SEO_CONFIG.site.url,
    "logo": SEO_CONFIG.site.logo,
    "description": SEO_CONFIG.site.description,
    "sameAs": Object.values(SEO_CONFIG.social),
    "founder": {
      "@type": "Organization",
      "name": SEO_CONFIG.organization.name,
      "url": SEO_CONFIG.organization.url,
    },
    "contactPoint": {
      "@type": "ContactPoint",
      ...SEO_CONFIG.organization.contactPoint,
    },
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SEO_CONFIG.site.name,
    "url": SEO_CONFIG.site.url,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SEO_CONFIG.site.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Commande d'exposés scolaires",
    "description": "Service de rédaction et livraison d'exposés scolaires de qualité",
    "provider": {
      "@type": "Organization",
      "name": SEO_CONFIG.organization.name,
      "url": SEO_CONFIG.organization.url,
    },
    "areaServed": ["BJ", "FR", "SN", "CM"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Catalogues d'exposés par matière",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Exposés scientifiques",
          },
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Exposés littéraires",
          },
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Exposés historiques",
          },
        },
      ],
    },
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
}
