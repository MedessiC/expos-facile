import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/shared/Logo";
import toast from "react-hot-toast";

export const Route = createFileRoute("/login")({ component: LoginPage });

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "6 caractères minimum"),
});

type FormData = z.infer<typeof schema>;

function LoginPage() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user && role) navigate({ to: `/${role}/dashboard` as any });
  }, [loading, user, role, navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword(data);
    setSubmitting(false);
    if (error) toast.error(error.message === "Invalid login credentials" ? "Identifiants invalides" : error.message);
    else toast.success("Connexion réussie");
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-brand p-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-6 md:p-8 shadow-elegant">
        <div className="flex justify-center mb-6"><Logo /></div>
        <h1 className="text-2xl font-bold text-center">Connexion</h1>
        <p className="text-center text-sm text-muted-foreground mt-1">
          Accédez à votre espace personnel
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full bg-midnight text-midnight-foreground hover:bg-midnight/90" disabled={submitting}>
            {submitting ? "Connexion…" : "Se connecter"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-midnight font-medium underline">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}
