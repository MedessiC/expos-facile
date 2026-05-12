import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Button } from "./button";

const testimonials = [
  {
    id: 1,
    name: "Marie K.",
    role: "Terminale C",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Mon exposé sur la Révolution Française était impeccable ! Livré 2 jours avant la deadline, exactement ce que je demandais.",
    subject: "Histoire - Révolution Française"
  },
  {
    id: 2,
    name: "Jean-Paul M.",
    role: "Seconde A",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Service incroyable ! Mon rédacteur a même ajouté des sources supplémentaires. Je recommande à tous mes amis.",
    subject: "Philosophie - Descartes"
  },
  {
    id: 3,
    name: "Fatou B.",
    role: "Première L",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Qualité professionnelle, délais respectés. L'équipe MIDEESSI assure vraiment la qualité avant livraison.",
    subject: "Littérature - Camus"
  },
  {
    id: 4,
    name: "Ahmed T.",
    role: "Terminale S",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Parfait pour mes études. Le paiement Mobile Money est super pratique. Je commande régulièrement maintenant.",
    subject: "Mathématiques - Analyse"
  }
];

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <div className="relative max-w-4xl mx-auto">
      <motion.div
        key={current.id}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl p-8 shadow-xl border"
      >
        <div className="flex items-start gap-6">
          <img
            src={current.avatar}
            alt={current.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-gold"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Quote className="w-6 h-6 text-gold" />
              <div className="flex">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
            </div>
            <p className="text-gray-700 mb-4 italic">"{current.text}"</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-midnight">{current.name}</p>
                <p className="text-sm text-gray-600">{current.role}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Sujet traité :</p>
                <p className="text-sm font-medium text-midnight">{current.subject}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-gold' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={prevTestimonial}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={nextTestimonial}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}