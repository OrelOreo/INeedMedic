import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import SearchForm from "./search-form";
import AppointmentPreview from "./appointment-preview";

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-center md:justify-start">
            <div className="inline-block px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 font-semibold text-sm">
              ✨ Simplifiez votre santé
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight text-center md:text-left">
            Prenez rendez-vous avec votre{" "}
            <span className="bg-linear-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
              médecin
            </span>{" "}
            en quelques clics
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed text-center md:text-left">
            Trouvez le bon praticien, consultez les disponibilités en temps réel
            et réservez votre consultation en toute simplicité.
          </p>
          <div className="flex justify-center md:justify-start">
            <Button
              size="lg"
              className="bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-xl shadow-emerald-200 group"
            >
              Trouver un médecin
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          <SearchForm />
        </div>
        <AppointmentPreview />
      </div>
    </section>
  );
}
