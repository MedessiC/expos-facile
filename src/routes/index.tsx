import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { GraduationCap, PenTool, ShieldCheck, Star, Clock, Smartphone } from "lucide-react";
import { useAuth } from "@/store/auth";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && role) {
      navigate({ to: `/${role}/dashboard` as any });
    }
  }, [loading, user, role, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-gradient-brand text-midnight-foreground">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 h-14">
          <Logo />
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm hover:underline">Connexion</Link>
            <Link
              to="/register"
              className="rounded-md bg-gold text-gold-foreground px-3 py-1.5 text-sm font-medium shadow-gold"
            >
              Inscription
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-brand text-midnight-foreground">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-20 text-center">
          <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wide">
            Par MIDEESSI · Cotonou
          </span>
          <h1 className="mt-4 text-4xl md:text-6xl font-bold leading-tight">
            Vos exposés scolaires,<br />
            <span className="text-gold-shimmer">soignés et livrés à temps.</span>
          </h1>
          <p className="mt-4 text-base md:text-lg opacity-90 max-w-2xl mx-auto">
            Commandez en quelques clics. Des rédacteurs humains qualifiés s'en occupent.
            Notre équipe valide chaque livraison avant qu'elle vous parvienne.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/register"
              className="rounded-lg bg-gold text-gold-foreground px-6 py-3 font-semibold shadow-gold hover:opacity-95"
            >
              Commander mon exposé
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-white/10 border border-white/20 px-6 py-3 font-medium hover:bg-white/20"
            >
              Devenir rédacteur
            </Link>
          </div>
          <p className="mt-3 text-xs opacity-70">À partir de 2 000 FCFA · Paiement Mobile Money</p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: PenTool, title: "Rédacteurs humains", desc: "Pas d'IA. Des étudiants et profs sélectionnés, par matière." },
            { icon: ShieldCheck, title: "Qualité validée", desc: "L'équipe MIDEESSI relit avant livraison. Zéro mauvaise surprise." },
            { icon: Clock, title: "Délais respectés", desc: "Vous fixez la date limite, on s'y tient." },
            { icon: Star, title: "Notez vos rédacteurs", desc: "Vos avis aident à maintenir un haut niveau d'exigence." },
            { icon: Smartphone, title: "100% mobile", desc: "Conçu pour smartphone. Commandez depuis n'importe où." },
            { icon: GraduationCap, title: "Pour tous les niveaux", desc: "Du CM2 à la Terminale, toutes matières." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl bg-card border p-5 shadow-elegant/30">
              <div className="grid place-items-center h-10 w-10 rounded-xl bg-midnight text-gold mb-3">
                <f.icon size={20} />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-3xl bg-midnight text-midnight-foreground p-8 md:p-12 text-center shadow-elegant">
          <h2 className="text-2xl md:text-3xl font-bold">Prêt à libérer vos soirées&nbsp;?</h2>
          <p className="mt-2 opacity-80">Créez votre compte en 30 secondes.</p>
          <Link
            to="/register"
            className="inline-block mt-6 rounded-lg bg-gold text-gold-foreground px-6 py-3 font-semibold shadow-gold"
          >
            Je commence
          </Link>
        </div>
      </section>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Exposétché — MIDEESSI
      </footer>
    </div>
  );
}
