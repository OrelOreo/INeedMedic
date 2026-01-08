import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Search, Stethoscope } from "lucide-react";
import FeatureCard from "@/components/feature-card";
import Step from "@/components/step";
import type { FeatureCard as FeatureCardInterface } from "@/types/feature-card";
import type { Step as StepInterface } from "@/types/step";

const features: FeatureCardInterface[] = [
  {
    icon: Search,
    title: "Trouvez un médecin",
    description:
      "Recherchez un professionnel de santé par spécialité et disponibilité.",
  },
  {
    icon: Calendar,
    title: "Prenez rendez-vous",
    description: "Réservez un créneau en ligne en quelques clics, 24h/24.",
  },
  {
    icon: Stethoscope,
    title: "Gérez vos consultations",
    description: "Retrouvez l’historique de vos rendez-vous.",
  },
];

const steps: StepInterface[] = [
  {
    number: "1",
    title: "Créez un compte",
  },
  {
    number: "2",
    title: "Choisissez un médécin",
  },
  {
    number: "3",
    title: "Réservez votre rendez-vous",
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-col w-4/5 md:w-full mx-auto">
      <section className="container mx-auto flex flex-col items-center text-center py-20 gap-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Prenez rendez-vous avec un médecin
          <span className="text-primary"> simplement</span>
        </h1>

        <p className="max-w-2xl text-muted-foreground text-lg">
          INeedDoctor vous permet de trouver rapidement un professionnel de
          santé et de gérer vos consultations en ligne, en toute simplicité.
        </p>

        <div className="flex flex-col md:flex-row gap-4">
          <Button size="lg" asChild>
            <Link href="/register">Créer un compte</Link>
          </Button>

          <Button size="lg" variant="outline" asChild>
            <Link href="/login">Se connecter</Link>
          </Button>
        </div>
      </section>

      <section className="bg-muted rounded-md md:rouned-none py-20 px-4 md:px-0">
        <div className="container mx-auto grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      <section className="container mx-auto py-20 text-center">
        <h2 className="text-3xl font-semibold mb-12">
          Comment ça fonctionne ?
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <Step key={step.number} number={step.number} title={step.title} />
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto text-center flex flex-col gap-6">
          <h2 className="text-3xl font-semibold">
            Gagnez du temps sur vos rendez-vous médicaux
          </h2>

          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">Commencer maintenant</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
