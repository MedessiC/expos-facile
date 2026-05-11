import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
  GraduationCap,
  PenTool,
  ShieldCheck,
  Star,
  Clock,
  Smartphone,
  CheckCircle,
  Users,
  Award,
  TrendingUp,
  ArrowRight,
  Quote,
  PlayCircle,
  BookOpen,
  Target,
  Zap,
  Heart,
  MessageSquare
} from "lucide-react";
import {
  AcademicCapIcon,
  UserGroupIcon,
  ClockIcon,
  StarIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "@/store/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ExposéTché - Plateforme MIDEESSI | Commande d'exposés scolaires" },
      { name: "description", content: "Commandez vos exposés scolaires sur ExposéTché. Rédacteurs certifiés, livrables validés, plateforme sécurisée. MIDEESSI - votre partenaire éducatif." },
      { property: "og:title", content: "ExposéTché - Commande d'exposés scolaires" },
      { property: "og:description", content: "Plateforme de confiance pour commander des exposés scolaires de qualité" },
      { property: "og:url", content: "https://exposetche.com/" },
      { name: "twitter:title", content: "ExposéTché - Exposés scolaires" },
      { name: "twitter:description", content: "Commandez vos exposés auprès de rédacteurs certifiés" },
    ],
    links: [
      { rel: "canonical", href: "https://exposetche.com/" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    commandes: 0,
    redacteurs: 0,
    satisfaction: 0,
    delai: 0
  });

  useEffect(() => {
    if (!loading && user && role) {
      navigate({ to: `/${role}/dashboard` as any });
    }
  }, [loading, user, role, navigate]);

  // Animation des statistiques
  useEffect(() => {
    const targetStats = { commandes: 1247, redacteurs: 89, satisfaction: 96, delai: 98 };
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setStats({
        commandes: Math.floor(targetStats.commandes * progress),
        redacteurs: Math.floor(targetStats.redacteurs * progress),
        satisfaction: Math.floor(targetStats.satisfaction * progress),
        delai: Math.floor(targetStats.delai * progress),
      });

      if (currentStep >= steps) clearInterval(timer);
    }, increment);

    return () => clearInterval(timer);
  }, []);

  const sampleReports = [
    {
      title: "Exposé sur la Révolution française",
      subject: "Histoire",
      level: "2nde",
      description: "Une analyse claire et structurée des causes et conséquences de la Révolution française.",
      cover: "Révolution française"
    },
    {
      title: "Synthèse sur l'Écosystème marin",
      subject: "SVT",
      level: "1ère S",
      description: "Un exposé illustré sur les chaînes alimentaires et la protection des océans.",
      cover: "Écosystème marin"
    },
    {
      title: "Commentaire de texte sur Victor Hugo",
      subject: "Français",
      level: "Terminale",
      description: "Interprétation approfondie et style modernisé pour un exposé percutant.",
      cover: "Victor Hugo"
    },
    {
      title: "Résolution de problèmes de trigonométrie",
      subject: "Maths",
      level: "1ère",
      description: "Des exemples pas à pas pour dominer les angles et fonctions trigonométriques.",
      cover: "Trigonométrie"
    }
  ];

  const testimonials = [
    {
      name: "Marie K.",
      school: "Terminale D - Lycée Béhanzin",
      rating: 5,
      text: "Super service ! Mon exposé de SVT était parfait, bien documenté et livré avant la date limite. Le rédacteur a même ajouté des schémas explicatifs.",
      subject: "SVT - Évolution"
    },
    {
      name: "Jean P.",
      school: "1ère L - Collège Modern",
      rating: 5,
      text: "Très satisfait du travail. L'exposé était bien structuré, sans faute et correspondait exactement à ma demande. Je recommande !",
      subject: "Français - Analyse littéraire"
    },
    {
      name: "Sophie M.",
      school: "Terminale C - Lycée Technique",
      rating: 5,
      text: "Service rapide et professionnel. J'ai pu suivre l'avancement en temps réel. Le résultat final était excellent.",
      subject: "Mathématiques - Géométrie"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header amélioré */}
      <header className="bg-gradient-brand text-midnight-foreground sticky top-0 z-50 shadow-lg">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 h-16">
          <Logo />
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="hidden sm:flex items-center gap-1 bg-white/10 text-white border-white/20">
              <CheckCircle size={14} />
              Service actif 24/7
            </Badge>
            <Link to="/login" className="text-sm hover:underline transition-colors">Connexion</Link>
            <Link
              to="/register"
              className="rounded-lg bg-gold text-gold-foreground px-4 py-2 text-sm font-semibold shadow-gold hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Inscription
            </Link>
          </div>
        </div>
      </header>

      {/* Hero amélioré avec animation */}
      <section className="bg-gradient-brand text-midnight-foreground relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-gold rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full animate-pulse delay-500"></div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 text-center relative">
          <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors">
            <Award size={14} className="mr-1" />
            Par MIDEESSI · Cotonou · Service Premium
          </Badge>

          <h1 className="text-3xl sm:text-4xl md:text-7xl xl:text-7xl 2xl:text-8xl font-bold leading-tight mb-6 animate-fade-in">
            Vos exposés scolaires,<br />
            <span className="text-gold-shimmer animate-pulse">soignés et livrés à temps.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl xl:text-xl 2xl:text-2xl opacity-90 max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto mb-8 leading-relaxed">
            Commandez en quelques clics. Des rédacteurs humains qualifiés s'en occupent.
            Notre équipe valide chaque livraison avant qu'elle vous parvienne.
          </p>

          <div className="flex flex-wrap justify-center gap-4 xl:gap-6 2xl:gap-8 mb-6">
            <Link
              to="/register"
              className="group rounded-xl bg-gold text-gold-foreground px-6 py-3 xl:px-7 xl:py-3 2xl:px-8 2xl:py-4 font-bold shadow-gold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2 cta-button text-sm xl:text-sm 2xl:text-base"
            >
              <PlayCircle size={20} className="xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" />
              Commander mon exposé
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform xl:w-4 xl:h-4 2xl:w-5 2xl:h-5" />
            </Link>
            <Link
              to="/register"
              className="group rounded-xl bg-white/10 border-2 border-white/30 px-6 py-3 xl:px-7 xl:py-3 2xl:px-8 2xl:py-4 font-semibold hover:bg-white/20 hover:border-white/50 transition-all duration-300 flex items-center gap-2 text-sm xl:text-sm 2xl:text-base"
            >
              <PenTool size={20} className="xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" />
              Devenir rédacteur
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform xl:w-4 xl:h-4 2xl:w-5 2xl:h-5" />
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" />
              À partir de 2 000 FCFA
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" />
              Paiement Mobile Money
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" />
              Livraison garantie
            </div>
          </div>
        </div>
      </section>

      {/* Statistiques animées */}
      <section className="py-16 bg-gradient-to-r from-midnight via-midnight to-midnight/90 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Chiffres qui parlent</h2>
            <p className="text-base sm:text-lg opacity-80">La confiance de plus de 1000 élèves</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 xl:gap-6 2xl:gap-8 max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto">
            <div className="text-center group">
              <div className="text-3xl sm:text-4xl md:text-5xl xl:text-5xl 2xl:text-6xl font-bold text-gold mb-2 stat-number group-hover:scale-110 transition-transform">
                {stats.commandes}+
              </div>
              <p className="text-sm xl:text-sm 2xl:text-base opacity-80">Commandes réalisées</p>
              <Progress value={(stats.commandes / 1247) * 100} className="mt-2 h-1 xl:h-1 2xl:h-2 progress-animated" />
            </div>

            <div className="text-center group">
              <div className="text-3xl sm:text-4xl md:text-5xl xl:text-5xl 2xl:text-6xl font-bold text-gold mb-2 stat-number group-hover:scale-110 transition-transform">
                {stats.redacteurs}+
              </div>
              <p className="text-sm xl:text-sm 2xl:text-base opacity-80">Rédacteurs actifs</p>
              <Progress value={(stats.redacteurs / 89) * 100} className="mt-2 h-1 xl:h-1 2xl:h-2 progress-animated" />
            </div>

            <div className="text-center group">
              <div className="text-3xl sm:text-4xl md:text-5xl xl:text-5xl 2xl:text-6xl font-bold text-gold mb-2 stat-number group-hover:scale-110 transition-transform">
                {stats.satisfaction}%
              </div>
              <p className="text-sm xl:text-sm 2xl:text-base opacity-80">Satisfaction client</p>
              <Progress value={stats.satisfaction} className="mt-2 h-1 xl:h-1 2xl:h-2 progress-animated" />
            </div>

            <div className="text-center group">
              <div className="text-3xl sm:text-4xl md:text-5xl xl:text-5xl 2xl:text-6xl font-bold text-gold mb-2 stat-number group-hover:scale-110 transition-transform">
                {stats.delai}%
              </div>
              <p className="text-sm xl:text-sm 2xl:text-base opacity-80">Délais respectés</p>
              <Progress value={stats.delai} className="mt-2 h-1 xl:h-1 2xl:h-2 progress-animated" />
            </div>
          </div>
        </div>
      </section>

      {/* Features améliorées avec cartes dynamiques */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Pourquoi choisir ExposéTché ?</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Une plateforme conçue pour les élèves du Bénin, avec des rédacteurs locaux et un suivi personnalisé.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: PenTool,
                heroIcon: AcademicCapIcon,
                title: "Rédacteurs humains qualifiés",
                desc: "Pas d'IA. Des étudiants et professeurs sélectionnés rigoureusement, spécialisés par matière.",
                color: "bg-blue-500",
                features: ["Diplômés universitaires", "Expérience pédagogique", "Évaluation continue"]
              },
              {
                icon: ShieldCheck,
                heroIcon: ShieldCheckIcon,
                title: "Qualité validée par MIDEESSI",
                desc: "Notre équipe relit chaque exposé avant livraison. Garantie zéro mauvaise surprise.",
                color: "bg-green-500",
                features: ["Contrôle qualité", "Correction orthographique", "Conformité académique"]
              },
              {
                icon: Clock,
                heroIcon: ClockIcon,
                title: "Délais respectés à 100%",
                desc: "Vous fixez la date limite, nous nous y tenons. Livraison anticipée possible.",
                color: "bg-purple-500",
                features: ["Respect des échéances", "Suivi en temps réel", "Support prioritaire"]
              },
              {
                icon: Star,
                heroIcon: StarIcon,
                title: "Système de notation",
                desc: "Notez vos rédacteurs. Les meilleurs sont mis en avant pour maintenir l'excellence.",
                color: "bg-yellow-500",
                features: ["Avis clients", "Classement dynamique", "Amélioration continue"]
              },
              {
                icon: Smartphone,
                heroIcon: DevicePhoneMobileIcon,
                title: "100% mobile & intuitif",
                desc: "Interface conçue pour smartphone. Commandez depuis votre lit, en cours, partout.",
                color: "bg-pink-500",
                features: ["Responsive design", "Application mobile", "Notifications push"]
              },
              {
                icon: GraduationCap,
                heroIcon: UserGroupIcon,
                title: "Tous niveaux & matières",
                desc: "Du CM2 à la Terminale, SVT, Maths, Français, Histoire-Géo, Anglais, Philosophie...",
                color: "bg-indigo-500",
                features: ["Tous niveaux", "Toutes matières", "Programme scolaire"]
              },
            ].map((feature, index) => (
              <Card key={feature.title} className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg overflow-hidden feature-card animate-slide-up xl:p-8 2xl:p-10" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 xl:p-7 2xl:p-8">
                  <div className="relative mb-4">
                    <div className={`w-16 h-16 xl:w-18 xl:h-18 2xl:w-20 2xl:h-20 ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon size={32} className="xl:w-8 xl:h-8 2xl:w-9 2xl:h-9 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 bg-gold rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <CheckCircle size={14} className="xl:w-4 xl:h-4 2xl:w-5 2xl:h-5 text-white" />
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl xl:text-xl 2xl:text-2xl font-bold mb-3 group-hover:text-gold transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-sm sm:text-base xl:text-base 2xl:text-lg text-muted-foreground mb-4 leading-relaxed">
                    {feature.desc}
                  </p>

                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm xl:text-sm 2xl:text-base text-muted-foreground">
                        <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Carrousel des exposés déjà rédigés */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Exemples d'exposés</h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
                Parcourez des couvertures d'exposés déjà réalisés et découvrez la qualité de nos livrables.
              </p>
            </div>
          </div>

          <Carousel className="relative" opts={{ align: "start", containScroll: "keepSnaps", draggable: true, loop: true }} plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}>
            <CarouselPrevious className="hidden sm:flex bg-midnight text-white hover:bg-gold border border-white/20" />
            <CarouselNext className="hidden sm:flex bg-midnight text-white hover:bg-gold border border-white/20" />
            <CarouselContent className="-ml-2 sm:-ml-4">
              {sampleReports.map((report, index) => (
                <CarouselItem key={index} className="min-w-[90%] sm:min-w-[45%] lg:min-w-[32%] pl-2 sm:pl-4">
                  <Card className="h-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-slate-200">
                    <div className="h-48 sm:h-56 bg-gradient-to-br from-midnight to-gold p-4 sm:p-6 text-white flex flex-col justify-between">
                      <div>
                        <div className="text-[0.65rem] uppercase tracking-[0.3em] opacity-80">Exposé rédigé</div>
                        <h3 className="text-2xl font-bold mt-4 leading-tight">{report.cover}</h3>
                      </div>
                      <div className="text-sm opacity-80">PDF disponible</div>
                    </div>
                    <CardContent className="p-6 flex flex-col justify-between gap-4">
                      <div>
                        <p className="font-semibold text-lg">{report.title}</p>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{report.description}</p>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {report.subject} · {report.level}
                        </span>
                        <Link to="/register" className="text-sm font-semibold text-gold hover:text-gold-foreground">
                          Lire
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* Section témoignages */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Ils nous font confiance</h2>
              <p className="text-base sm:text-lg text-muted-foreground">Découvrez les avis de nos élèves satisfaits</p>
            </div>
          </div>

          <Carousel className="relative" opts={{ align: "start", containScroll: "keepSnaps", draggable: true, loop: true }} plugins={[Autoplay({ delay: 6000, stopOnInteraction: true })]}>
            <CarouselPrevious className="hidden sm:flex bg-midnight text-white hover:bg-gold border border-white/20" />
            <CarouselNext className="hidden sm:flex bg-midnight text-white hover:bg-gold border border-white/20" />
            <CarouselContent className="-ml-2 sm:-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="min-w-[90%] sm:min-w-[60%] lg:min-w-[40%] pl-2 sm:pl-4">
                  <Card className="h-full rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200 xl:p-7 2xl:p-8">
                    <CardContent className="p-6 xl:p-7 2xl:p-8">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} size={16} className="xl:w-4 xl:h-4 2xl:w-5 2xl:h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>

                      <Quote className="text-gold mb-4 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" size={24} />

                      <p className="text-sm sm:text-base xl:text-base 2xl:text-lg text-muted-foreground mb-6 italic leading-relaxed">
                        "{testimonial.text}"
                      </p>

                      <div className="border-t pt-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12">
                            <AvatarFallback className="bg-gold text-white font-semibold text-sm xl:text-sm 2xl:text-base">
                              {testimonial.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-sm xl:text-sm 2xl:text-base">{testimonial.name}</p>
                            <p className="text-xs xl:text-xs 2xl:text-sm text-muted-foreground">{testimonial.school}</p>
                            <p className="text-xs text-gold font-medium">{testimonial.subject}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* Processus visuel */}
      <section className="py-20 bg-midnight text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Comment ça marche ?</h2>
            <p className="text-base sm:text-lg opacity-80">Simple comme bonjour en 4 étapes</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 xl:gap-6 2xl:gap-8">
            {[
              {
                step: "01",
                icon: BookOpen,
                title: "Commandez",
                desc: "Remplissez le formulaire avec votre sujet, matière, niveau et date limite."
              },
              {
                step: "02",
                icon: Target,
                title: "Attribution",
                desc: "Un rédacteur spécialisé dans votre matière est automatiquement assigné."
              },
              {
                step: "03",
                icon: PenTool,
                title: "Rédaction",
                desc: "Le rédacteur travaille sur votre exposé avec suivi en temps réel."
              },
              {
                step: "04",
                icon: CheckCircle,
                title: "Livraison",
                desc: "Validation par notre équipe, puis livraison sécurisée."
              }
            ].map((step, index) => (
              <div key={index} className="text-center group process-step animate-slide-up xl:p-4 2xl:p-6" style={{ animationDelay: `${index * 0.3}s` }}>
                <div className="relative mb-6">
                  <div className="w-20 h-20 xl:w-22 xl:h-22 2xl:w-24 2xl:h-24 bg-gold rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 step-icon">
                    <step.icon size={32} className="xl:w-8 xl:h-8 2xl:w-9 2xl:h-9 text-midnight" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 bg-white text-midnight rounded-full flex items-center justify-center font-bold text-sm xl:text-sm 2xl:text-base">
                    {step.step}
                  </div>
                  {index < 3 && (
                    <ArrowRight className="hidden md:block absolute top-10 xl:top-11 2xl:top-12 -right-4 xl:-right-5 2xl:-right-6 text-gold animate-bounce-gentle xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" size={24} />
                  )}
                </div>

                <h3 className="text-lg sm:text-xl xl:text-xl 2xl:text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-sm sm:text-base xl:text-base 2xl:text-lg text-white/80 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final amélioré */}
      <section className="py-20 bg-gradient-brand text-midnight-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full animate-pulse floating-element"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gold rounded-full animate-pulse delay-1000 floating-element delay-1"></div>
        </div>

        <div className="mx-auto max-w-4xl xl:max-w-5xl 2xl:max-w-6xl px-4 text-center relative">
          <div className="mb-8">
            <Heart size={48} className="xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 text-gold mx-auto mb-4" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl xl:text-5xl 2xl:text-6xl font-bold mb-6">
            Prêt à libérer vos soirées d'étude ?
          </h2>

          <p className="text-base sm:text-lg md:text-xl xl:text-xl 2xl:text-2xl opacity-90 mb-8 max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto leading-relaxed">
            Rejoignez plus de 1000 élèves qui nous font confiance pour leurs exposés scolaires.
            Créez votre compte en 30 secondes et commandez dès maintenant.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 xl:gap-6 2xl:gap-8 justify-center mb-8">
            <Link
              to="/register"
              className="group rounded-xl bg-gold text-gold-foreground px-8 py-4 xl:px-9 xl:py-4 2xl:px-10 2xl:py-5 font-bold shadow-gold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-base xl:text-base 2xl:text-lg"
            >
              <Zap size={20} className="xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" />
              Je commence maintenant
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform xl:w-4 xl:h-4 2xl:w-5 2xl:h-5" />
            </Link>

            <div className="flex items-center gap-4 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                Gratuit d'inscription
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                Sans engagement
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <MessageSquare size={24} className="text-gold mx-auto mb-2" />
              <p className="font-semibold">Support 24/7</p>
              <p className="text-sm opacity-80">Une question ? On répond</p>
            </div>

            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <ShieldCheck size={24} className="text-gold mx-auto mb-2" />
              <p className="font-semibold">Paiement sécurisé</p>
              <p className="text-sm opacity-80">Mobile Money garanti</p>
            </div>

            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <TrendingUp size={24} className="text-gold mx-auto mb-2" />
              <p className="font-semibold">Qualité garantie</p>
              <p className="text-sm opacity-80">Ou remboursé</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer amélioré */}
      <footer className="bg-midnight text-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Logo />
              <p className="text-sm opacity-80 mt-4 leading-relaxed">
                La plateforme de confiance pour vos exposés scolaires au Bénin.
                Qualité, rapidité, satisfaction garantie.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Service</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link to="/register" className="hover:text-gold transition-colors">Commander</Link></li>
                <li><Link to="/register" className="hover:text-gold transition-colors">Devenir rédacteur</Link></li>
                <li><Link to="/login" className="hover:text-gold transition-colors">Connexion</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:text-gold transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Aide</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">MIDEESSI</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>Cotonou, Bénin</li>
                <li>Service éducatif</li>
                <li>© {new Date().getFullYear()} ExposéTché</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-sm opacity-60">
            <p>Plateforme développée avec ❤️ pour les élèves béninois</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
