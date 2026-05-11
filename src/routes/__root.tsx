import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/store/auth";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gold-shimmer">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page introuvable</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-midnight px-4 py-2 text-sm font-medium text-midnight-foreground hover:opacity-90"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Une erreur est survenue</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-md bg-midnight px-4 py-2 text-sm text-midnight-foreground"
          >
            Réessayer
          </button>
          <a href="/" className="rounded-md border px-4 py-2 text-sm">Accueil</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ExposéTché - Plateforme MIDEESSI | Commande d'exposés scolaires en ligne" },
      { name: "description", content: "ExposéTché par MIDEESSI : plateforme de commande d'exposés scolaires de qualité. Rédacteurs certifiés, livrables validés, paiements sécurisés. Élèves et rédacteurs bienvenus." },
      { name: "keywords", content: "exposés scolaires, rédaction d'exposés, aide scolaire, MIDEESSI, plateforme éducative, travaux scolaires" },
      { name: "author", content: "MIDEESSI" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { property: "og:site_name", content: "ExposéTché" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "ExposéTché - Plateforme MIDEESSI | Commande d'exposés scolaires" },
      { property: "og:description", content: "Commandez vos exposés scolaires auprès de rédacteurs certifiés. Plateforme sécurisée et fiable de MIDEESSI." },
      { property: "og:url", content: "https://exposetche.com" },
      { property: "og:image", content: "https://exposetche.com/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "ExposéTché - Commande d'exposés scolaires" },
      { name: "twitter:description", content: "Plateforme de commande d'exposés scolaires par MIDEESSI" },
      { name: "theme-color", content: "#000000" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: "https://exposetche.com" },
      { rel: "alternate", hrefLang: "fr", href: "https://exposetche.com" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ExposéTché",
    "url": "https://exposetche.com",
    "logo": "https://exposetche.com/logo.png",
    "description": "Plateforme de commande d'exposés scolaires par MIDEESSI",
    "sameAs": [
      "https://www.facebook.com/mideessi",
      "https://www.instagram.com/mideessi",
      "https://www.twitter.com/mideessi"
    ],
    "founder": {
      "@type": "Organization",
      "name": "MIDEESSI"
    }
  };

  return (
    <html lang="fr">
      <head>
        <HeadContent />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <Toaster position="top-center" toastOptions={{ duration: 3500 }} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
