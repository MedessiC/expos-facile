import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import {
  GraduationCap,
  PenTool,
  ShieldCheck,
  Star,
  Clock,
  Smartphone,
  CheckCircle,
  ArrowRight,
  Award,
  Users,
  BookOpen,
  Zap,
  CreditCard,
  Headphones,
  Lock,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/store/auth";
import { AnimatedSection, FloatingCard, fadeInUp, staggerContainer } from "@/components/ui/animations";
import { TestimonialsCarousel } from "@/components/ui/testimonials-carousel";
import { OrderWorkflowAnimation } from "@/components/ui/order-workflow";
import { AnimatedBackground } from "@/components/ui/animated-background";

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
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <AnimatedBackground />

      {/* Header */}
      <motion.header
        className="relative z-10 bg-gradient-brand text-midnight-foreground shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 h-16">
          <Logo />
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm hover:underline transition-colors">Connexion</Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="rounded-lg bg-gold text-gold-foreground px-4 py-2 text-sm font-semibold shadow-gold hover:shadow-lg transition-all"
              >
                Inscription
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative z-10 bg-gradient-to-br from-midnight via-midnight/95 to-midnight/80 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-gold/5"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.span
              className="inline-flex items-center gap-2 rounded-full bg-gold/20 border border-gold/30 px-4 py-2 text-sm font-medium tracking-wide mb-6"
              variants={fadeInUp}
            >
              Par MIDEESSI · Cotonou · Service Premium
            </motion.span>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6"
              variants={fadeInUp}
            >
              Vos exposés scolaires,
              <span className="block text-gold bg-gradient-to-r from-gold via-yellow-400 to-orange-400 bg-clip-text text-transparent animate-pulse">
                soignés et livrés à temps.
              </span>
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl opacity-90 max-w-3xl mx-auto mb-8 leading-relaxed px-4"
              variants={fadeInUp}
            >
              Commandez en quelques clics. Des rédacteurs humains qualifiés s'en occupent.
              Notre équipe valide chaque livraison avant qu'elle vous parvienne.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4 mb-8 px-4"
              variants={fadeInUp}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group"
              >
                <Link
                  to="/register"
                  className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-gold to-yellow-500 text-midnight px-6 sm:px-8 py-4 font-bold text-base sm:text-lg shadow-2xl hover:shadow-gold/50 transition-all duration-300 group-hover:shadow-3xl"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Zap className="w-5 h-5" />
                  </motion.div>
                  <span>Commander mon exposé</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/register"
                  className="inline-flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/30 px-6 sm:px-8 py-4 font-semibold text-base sm:text-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                >
                  <PenTool className="w-5 h-5" />
                  <span>Devenir rédacteur</span>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex flex-wrap justify-center gap-6 text-sm opacity-80"
              variants={fadeInUp}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>À partir de 2 000 FCFA</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Paiement Mobile Money</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Livraison garantie</span>
              </div>
            </motion.div>
          </motion.div>

          {/* CTA Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-6 h-6 text-gold" />
          </motion.div>
        </div>
      </section>

      {/* Social Proof & Trust Badges */}
      <motion.section
        className="relative z-10 -mt-8 mb-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <motion.div
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <div className="text-2xl font-bold text-midnight">4.9/5</div>
                <div className="text-sm text-muted-foreground">+500 avis</div>
              </motion.div>

              <motion.div
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
              >
                <Clock className="w-8 h-8 text-green-500 mb-2" />
                <div className="text-2xl font-bold text-midnight">24h</div>
                <div className="text-sm text-muted-foreground">Délai moyen</div>
              </motion.div>

              <motion.div
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
              >
                <ShieldCheck className="w-8 h-8 text-blue-500 mb-2" />
                <div className="text-2xl font-bold text-midnight">100%</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </motion.div>

              <motion.div
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
              >
                <Users className="w-8 h-8 text-purple-500 mb-2" />
                <div className="text-2xl font-bold text-midnight">50+</div>
                <div className="text-sm text-muted-foreground">Rédacteurs</div>
              </motion.div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-green-500" />
                  <span>Paiement sécurisé</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-500" />
                  <span>Rédaction sans IA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-purple-500" />
                  <span>Support 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <AnimatedSection className="relative z-10 mx-auto max-w-7xl px-4 py-12 md:py-20">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 px-4"
            variants={fadeInUp}
          >
            Pourquoi nous choisir ?
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4"
            variants={fadeInUp}
          >
            Une plateforme conçue pour les étudiants, par des professionnels de l'éducation
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {[
            {
              icon: PenTool,
              title: "Rédacteurs qualifiés",
              desc: "Étudiants en Master et professeurs expérimentés, spécialisés par matière.",
              color: "from-blue-500 to-blue-600",
              delay: 0
            },
            {
              icon: ShieldCheck,
              title: "Qualité garantie",
              desc: "Chaque exposé est relu et validé par l'équipe MIDEESSI avant livraison.",
              color: "from-green-500 to-green-600",
              delay: 0.1
            },
            {
              icon: Clock,
              title: "Délais respectés",
              desc: "Vous fixez la deadline, nous la tenons. Livraison anticipée possible.",
              color: "from-purple-500 to-purple-600",
              delay: 0.2
            },
            {
              icon: Star,
              title: "Avis clients",
              desc: "Note moyenne de 4.9/5 basée sur plus de 500 commandes satisfaites.",
              color: "from-yellow-500 to-orange-500",
              delay: 0.3
            },
            {
              icon: Smartphone,
              title: "100% mobile",
              desc: "Application optimisée pour smartphone. Commandez partout, anytime.",
              color: "from-pink-500 to-rose-500",
              delay: 0.4
            },
            {
              icon: Lock,
              title: "Paiement sécurisé",
              desc: "Mobile Money, cartes bancaires. Vos données sont protégées.",
              color: "from-indigo-500 to-purple-600",
              delay: 0.5
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              transition={{ delay: feature.delay }}
            >
              <FloatingCard className="p-4 md:p-6 h-full group cursor-pointer">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 group-hover:text-midnight transition-colors">{feature.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">{feature.desc}</p>
              </FloatingCard>
            </motion.div>
          ))}
        </motion.div>
      </AnimatedSection>

      {/* Testimonials Section */}
      <AnimatedSection className="relative z-10 bg-gradient-to-br from-muted/20 to-muted/5 py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 px-4"
              variants={fadeInUp}
            >
              Ils nous font confiance
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4"
              variants={fadeInUp}
            >
              Découvrez les témoignages de nos étudiants satisfaits
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <TestimonialsCarousel />
          </motion.div>
        </div>
      </AnimatedSection>


      {/* Pricing */}
      <AnimatedSection className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:py-24">
        <motion.div
          className="text-center mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-4"
            variants={fadeInUp}
          >
            Tarifs transparents
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            Des prix adaptés à tous les budgets étudiants
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {[
            {
              name: "Express",
              price: "3 000",
              period: "FCFA",
              desc: "Livraison en 24h",
              features: ["Rédaction complète", "Sources incluses", "Révision gratuite"],
              popular: false
            },
            {
              name: "Standard",
              price: "2 500",
              period: "FCFA",
              desc: "Livraison en 48h",
              features: ["Rédaction complète", "Sources incluses", "Révision gratuite", "Suivi personnalisé"],
              popular: true
            },
            {
              name: "Économique",
              price: "2 000",
              period: "FCFA",
              desc: "Livraison en 72h",
              features: ["Rédaction complète", "Sources de base", "Révision gratuite"],
              popular: false
            }
          ].map((plan, index) => (
            <motion.div key={plan.name} variants={fadeInUp}>
              <FloatingCard className={`p-8 h-full relative ${plan.popular ? 'ring-2 ring-gold shadow-gold' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gold text-midnight px-4 py-1 rounded-full text-sm font-semibold">
                      Le plus choisi
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-black text-gold mb-1">
                    {plan.price} <span className="text-lg font-normal text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.desc}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/register"
                    className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all ${
                      plan.popular
                        ? 'bg-gold text-midnight hover:shadow-gold'
                        : 'bg-midnight text-white hover:bg-midnight/90'
                    }`}
                  >
                    Commander maintenant
                  </Link>
                </motion.div>
              </FloatingCard>
            </motion.div>
          ))}
        </motion.div>
      </AnimatedSection>

      {/* Trust Indicators */}
      <AnimatedSection className="relative z-10 mx-auto max-w-7xl px-4 py-16">
        <motion.div
          className="grid md:grid-cols-4 gap-8 text-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {[
            { number: "500+", label: "Commandes réalisées" },
            { number: "4.9/5", label: "Note moyenne" },
            { number: "98%", label: "Satisfaction client" },
            { number: "24h", label: "Délai moyen" }
          ].map((stat, index) => (
            <motion.div key={stat.label} variants={fadeInUp}>
              <FloatingCard className="p-6">
                <div className="text-3xl md:text-4xl font-black text-gold mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </FloatingCard>
            </motion.div>
          ))}
        </motion.div>
      </AnimatedSection>

      {/* Final CTA */}
      <AnimatedSection className="relative z-10 bg-gradient-to-r from-midnight to-midnight/90 text-white py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              className="text-3xl md:text-5xl font-bold mb-6"
              variants={fadeInUp}
            >
              Prêt à réussir vos études ?
            </motion.h2>

            <motion.p
              className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Rejoignez des milliers d'étudiants qui nous font confiance pour leurs exposés scolaires.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              variants={fadeInUp}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-gold text-midnight px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-gold/50 transition-all"
                >
                  <Zap className="w-5 h-5" />
                  Créer mon compte
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-white/10 border-2 border-white/30 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
                >
                  Se connecter
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex flex-wrap justify-center gap-6 mt-8 text-sm opacity-80"
              variants={fadeInUp}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span>Paiement 100% sécurisé</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-blue-400" />
                <span>Support 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gold" />
                <span>Garantie satisfaction</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="relative z-10 bg-midnight text-white py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Logo />
              <p className="text-sm opacity-80 mt-4 max-w-xs">
                La plateforme de confiance pour vos exposés scolaires.
                Qualité, rapidité et satisfaction garantie.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Service</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link to="/register" className="hover:text-gold transition-colors">Commander</Link></li>
                <li><Link to="/register" className="hover:text-gold transition-colors">Devenir rédacteur</Link></li>
                <li><a href="#pricing" className="hover:text-gold transition-colors">Tarifs</a></li>
                <li><a href="#faq" className="hover:text-gold transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="mailto:support@exposetche.com" className="hover:text-gold transition-colors">Contact</a></li>
                <li><a href="#help" className="hover:text-gold transition-colors">Aide</a></li>
                <li><a href="#status" className="hover:text-gold transition-colors">Statut</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#privacy" className="hover:text-gold transition-colors">Confidentialité</a></li>
                <li><a href="#terms" className="hover:text-gold transition-colors">CGU</a></li>
                <li><a href="#cookies" className="hover:text-gold transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-sm opacity-60">
            <p>&copy; 2026 ExposéTché - MIDEESSI. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
