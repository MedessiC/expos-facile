import { useNavigate, Link, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/store/auth";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Home, LogOut, LayoutDashboard, FilePlus2, Briefcase, Wallet, User as UserIcon, ShieldCheck, Users as UsersIcon, ClipboardList, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/constants";

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const NAV: Record<Role, NavItem[]> = {
  eleve: [
    { to: "/eleve/dashboard", label: "Accueil", icon: LayoutDashboard },
    { to: "/eleve/nouvelle-commande", label: "Commander", icon: FilePlus2 },
    { to: "/eleve/commandes", label: "Mes commandes", icon: ClipboardList },
  ],
  redacteur: [
    { to: "/redacteur/dashboard", label: "Accueil", icon: LayoutDashboard },
    { to: "/redacteur/missions", label: "Missions", icon: Briefcase },
    { to: "/redacteur/paiements", label: "Paiements", icon: Wallet },
    { to: "/redacteur/profil", label: "Profil", icon: UserIcon },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Tableau", icon: LayoutDashboard },
    { to: "/admin/commandes", label: "Commandes", icon: ClipboardList },
    { to: "/admin/validation", label: "Valider", icon: ShieldCheck },
    { to: "/admin/redacteurs", label: "Rédacteurs", icon: UsersIcon },
    { to: "/admin/paiements", label: "Paiements", icon: Wallet },
  ],
};

export function AppLayout({
  children,
  requireRole,
}: {
  children: ReactNode;
  requireRole?: Role;
}) {
  const { user, role, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/login" });
    else if (requireRole && role && role !== requireRole) {
      navigate({ to: `/${role}/dashboard` as any });
    }
  }, [loading, user, role, requireRole, navigate]);

  if (loading || !user || !role) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="animate-pulse text-muted-foreground">Chargement…</div>
      </div>
    );
  }

  const items = NAV[role];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-brand text-midnight-foreground border-b border-sidebar-border/40">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 h-14">
          <Link to={`/${role}/dashboard` as any} className="text-midnight-foreground">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/" className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20 transition-colors flex items-center gap-2">
              <Home size={16} />
              <span className="hidden sm:inline">Accueil site</span>
            </Link>
            <Button
              size="sm"
              variant="ghost"
              className="text-midnight-foreground hover:bg-white/10"
              aria-label="Notifications"
            >
              <Bell size={16} />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-sm opacity-80">
              {profile?.prenom} · <span className="capitalize">{role}</span>
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="text-midnight-foreground hover:bg-white/10"
              onClick={async () => {
                await signOut();
                navigate({ to: "/login" });
              }}
            >
              <LogOut size={16} />
              <span className="hidden sm:inline ml-1">Quitter</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Desktop sidebar + main */}
      <div className="flex-1 mx-auto w-full max-w-6xl flex">
        <aside className="hidden md:flex w-56 flex-col gap-1 p-4 border-r">
          {items.map((it) => {
            const active = path.startsWith(it.to);
            return (
              <Link
                key={it.to}
                to={it.to as any}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-midnight text-midnight-foreground"
                    : "hover:bg-secondary text-foreground/80",
                )}
              >
                <it.icon size={16} />
                {it.label}
              </Link>
            );
          })}
        </aside>

        <main className="flex-1 p-4 pb-24 md:pb-8">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t shadow-elegant">
        <div className="mx-auto max-w-md grid" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
          {items.map((it) => {
            const active = path.startsWith(it.to);
            return (
              <Link
                key={it.to}
                to={it.to as any}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2.5 text-[11px]",
                  active ? "text-midnight" : "text-muted-foreground",
                )}
              >
                <it.icon size={20} className={active ? "text-gold" : ""} />
                <span>{it.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

