import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Role } from "@/lib/constants";

interface Profile {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  ecole: string | null;
  classe: string | null;
  niveau_etudes: string | null;
  matieres: string[] | null;
  cv_url: string | null;
  statut: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  role: Role | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (uid: string, userMetadata?: any) => {
    const [{ data: roleData }, { data: profileData }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", uid).maybeSingle(),
      supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
    ]);
    // Use user_metadata role as fallback if not in user_roles table
    const roleFromDB = (roleData?.role as Role) ?? (userMetadata?.role as Role) ?? null;
    setRole(roleFromDB);
    setProfile((profileData as Profile) ?? null);
  };

  const refresh = async () => {
    if (user?.id) await fetchUserData(user.id, user.user_metadata);
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        setTimeout(() => {
          fetchUserData(sess.user.id, sess.user.user_metadata);
        }, 0);
      } else {
        setRole(null);
        setProfile(null);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        fetchUserData(data.session.user.id, data.session.user.user_metadata).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
    setProfile(null);
  };

  return (
    <Ctx.Provider value={{ user, session, role, profile, loading, signOut, refresh }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
