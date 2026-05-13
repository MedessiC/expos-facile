import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Controller, Control, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { isValidPhoneNumber } from "libphonenumber-js";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Logo } from "@/components/shared/Logo";
import { MATIERES } from "@/lib/constants";
import toast from "react-hot-toast";

export const Route = createFileRoute("/register")({ component: RegisterPage });

const eleveSchema = z.object({
  nom: z.string().min(2, "Requis"),
  prenom: z.string().min(2, "Requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "6 caractères minimum"),
  telephone: z.string().min(8, "Téléphone requis").refine((value) => isValidPhoneNumber(value || ""), {
    message: "Numéro de téléphone invalide",
  }),
  ecole: z.string().min(2, "École requise"),
  classe: z.string().min(1, "Classe requise"),
});

const redacteurSchema = z.object({
  nom: z.string().min(2, "Requis"),
  prenom: z.string().min(2, "Requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "6 caractères minimum"),
  telephone: z.string().min(8, "Téléphone requis").refine((value) => isValidPhoneNumber(value || ""), {
    message: "Numéro de téléphone invalide",
  }),
  niveau_etudes: z.string().min(2, "Niveau requis"),
  matieres: z.array(z.string()).min(1, "Choisissez au moins une matière"),
});

type EleveData = z.infer<typeof eleveSchema>;
type RedData = z.infer<typeof redacteurSchema>;

function RegisterPage() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"eleve" | "redacteur">("eleve");

  useEffect(() => {
    if (!loading && user && role) navigate({ to: `/${role}/dashboard` as any });
  }, [loading, user, role, navigate]);

  return (
    <div className="min-h-screen bg-gradient-brand p-4 flex items-start justify-center">
      <div className="w-full max-w-lg rounded-2xl bg-card p-6 md:p-8 shadow-elegant my-8">
        <div className="flex justify-center mb-6"><Logo /></div>
        <h1 className="text-2xl font-bold text-center">Créer un compte</h1>
        <p className="text-center text-sm text-muted-foreground mt-1">
          Choisissez votre profil pour commencer
        </p>
        <div className="mt-4 text-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2 text-sm text-midnight hover:text-gold transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retour à l’accueil
          </Link>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mt-6">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="eleve">Élève</TabsTrigger>
            <TabsTrigger value="redacteur">Rédacteur</TabsTrigger>
          </TabsList>
          <TabsContent value="eleve" className="mt-4">
            <EleveForm />
          </TabsContent>
          <TabsContent value="redacteur" className="mt-4">
            <RedacteurForm />
          </TabsContent>
        </Tabs>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Déjà inscrit ? <Link to="/login" className="text-midnight font-medium underline">Connexion</Link>
        </p>
      </div>
    </div>
  );
}

function EleveForm() {
  const [busy, setBusy] = useState(false);
  const { register, handleSubmit, control, formState: { errors } } = useForm<EleveData>({ resolver: zodResolver(eleveSchema) });

  const onSubmit = async (data: EleveData) => {
    setBusy(true);
    const { error, data: signUpData } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          role: "eleve",
          nom: data.nom,
          prenom: data.prenom,
          telephone: data.telephone,
          ecole: data.ecole,
          classe: data.classe,
        },
      },
    });
    
    if (error) {
      setBusy(false);
      toast.error(error.message);
      return;
    }
    
    // Try auto-login for immediate redirect
    if (signUpData.user) {
      try {
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        toast.success("Compte créé ! Bienvenue !");
      } catch (e) {
        setBusy(false);
        toast.info("Compte créé ! Vérifiez votre email pour vous connecter.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Prénom" error={errors.prenom?.message}>
          <Input {...register("prenom")} />
        </Field>
        <Field label="Nom" error={errors.nom?.message}>
          <Input {...register("nom")} />
        </Field>
      </div>
      <Field label="École" error={errors.ecole?.message}>
        <Input {...register("ecole")} />
      </Field>
      <Field label="Classe" error={errors.classe?.message}>
        <Input placeholder="Ex: Terminale D" {...register("classe")} />
      </Field>
      <PhoneField control={control} error={errors.telephone?.message} />
      <Field label="Email" error={errors.email?.message}>
        <Input type="email" {...register("email")} />
      </Field>
      <Field label="Mot de passe" error={errors.password?.message}>
        <Input type="password" {...register("password")} />
      </Field>
      <Button type="submit" disabled={busy} className="w-full bg-midnight text-midnight-foreground hover:bg-midnight/90">
        {busy ? "Création…" : "Créer mon compte"}
      </Button>
    </form>
  );
}

function RedacteurForm() {
  const [busy, setBusy] = useState(false);
  const [matieres, setMatieres] = useState<string[]>([]);
  const [cv, setCv] = useState<File | null>(null);
  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm<RedData>({
    resolver: zodResolver(redacteurSchema),
    defaultValues: { matieres: [] },
  });

  const toggleMatiere = (m: string) => {
    const next = matieres.includes(m) ? matieres.filter((x) => x !== m) : [...matieres, m];
    setMatieres(next);
    setValue("matieres", next, { shouldValidate: true });
  };

  const onSubmit = async (data: RedData) => {
    setBusy(true);
    const { data: signUp, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          role: "redacteur",
          nom: data.nom,
          prenom: data.prenom,
          telephone: data.telephone,
          niveau_etudes: data.niveau_etudes,
          matieres: data.matieres,
        },
      },
    });
    if (error) {
      setBusy(false);
      toast.error(error.message);
      return;
    }
    // Try to upload CV if user is now signed in
    if (cv && signUp.user) {
      const path = `${signUp.user.id}/cv-${Date.now()}-${cv.name}`;
      const { error: upErr } = await supabase.storage.from("cv-redacteurs").upload(path, cv);
      if (!upErr) {
        await supabase.from("profiles").update({ cv_url: path }).eq("id", signUp.user.id);
      }
    }
    
    // Try auto-login, otherwise show email verification message
    try {
      await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      toast.success("Compte créé ! En attente de validation.");
    } catch (e) {
      setBusy(false);
      toast.info("Compte créé ! Validation par MIDEESSI sous 24h.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Prénom" error={errors.prenom?.message}>
          <Input {...register("prenom")} />
        </Field>
        <Field label="Nom" error={errors.nom?.message}>
          <Input {...register("nom")} />
        </Field>
      </div>
      <Field label="Niveau d'études" error={errors.niveau_etudes?.message}>
        <Input placeholder="Ex: Licence 3 SVT" {...register("niveau_etudes")} />
      </Field>
      <PhoneField control={control} error={errors.telephone?.message} />
      <Field label="Email" error={errors.email?.message}>
        <Input type="email" {...register("email")} />
      </Field>
      <Field label="Mot de passe" error={errors.password?.message}>
        <Input type="password" {...register("password")} />
      </Field>
      <div>
        <Label>Matières maîtrisées</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {MATIERES.map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => toggleMatiere(m)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                matieres.includes(m)
                  ? "bg-midnight text-midnight-foreground border-midnight"
                  : "bg-card hover:bg-secondary"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        {errors.matieres && <p className="text-xs text-destructive mt-1">{errors.matieres.message as string}</p>}
      </div>
      <div>
        <Label>CV ou lettre de motivation (PDF, optionnel)</Label>
        <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCv(e.target.files?.[0] ?? null)} />
      </div>
      <Button type="submit" disabled={busy} className="w-full bg-midnight text-midnight-foreground hover:bg-midnight/90">
        {busy ? "Création…" : "Postuler"}
      </Button>
    </form>
  );
}

function PhoneField({ control, error }: { control: Control<EleveData | RedData>; error?: string }) {
  return (
    <div>
      <Label>Téléphone</Label>
      <Controller
        name="telephone"
        control={control}
        render={({ field }) => (
          <PhoneInput
            international
            defaultCountry="BJ"
            countryCallingCodeEditable={false}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            inputComponent={Input}
            inputClassName="w-full"
            countrySelectProps={{
              className:
                "h-9 rounded-l-md border border-r-0 border-input bg-transparent px-3 text-base text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            }}
            className="w-full"
          />
        )}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
