import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

export default function CtaSection() {
  return (
    <section className="py-20 bg-linear-to-r from-emerald-500 to-teal-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
          Prêt à prendre soin de votre santé ?
        </h2>
        <p className="text-lg sm:text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
          Rejoignez des milliers de patients qui font confiance à INeedMedic
          pour leurs rendez-vous médicaux
        </p>
        <Button
          size="lg"
          className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-2xl px-8 py-6 text-lg font-semibold cursor-pointer"
        >
          Commencer maintenant
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </section>
  );
}
