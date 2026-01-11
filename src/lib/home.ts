import { Calendar, Users, Shield } from "lucide-react";

export const SPECIALTIES = [
  { value: "generaliste", label: "Médecin généraliste" },
  { value: "cardiologue", label: "Cardiologue" },
  { value: "dermatologue", label: "Dermatologue" },
  { value: "gynecologue", label: "Gynécologue" },
  { value: "ophtalmologue", label: "Ophtalmologue" },
  { value: "orl", label: "ORL" },
  { value: "pediatre", label: "Pédiatre" },
  { value: "psychiatre", label: "Psychiatre" },
  { value: "psychologue", label: "Psychologue" },
  { value: "radiologue", label: "Radiologue" },
  { value: "dentiste", label: "Dentiste" },
  { value: "kinesitherapeute", label: "Kinésithérapeute" },
] as const;

export const FEATURES = [
  {
    icon: Calendar,
    title: "Réservation instantanée",
    description:
      "Consultez les disponibilités en temps réel et réservez votre rendez-vous 24h/24, 7j/7",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Users,
    title: "Réseau de médecins",
    description:
      "Accédez à un large réseau de professionnels de santé qualifiés et vérifiés",
    color: "from-teal-500 to-cyan-600",
  },
  {
    icon: Shield,
    title: "Données sécurisées",
    description:
      "Vos informations médicales sont protégées selon les normes les plus strictes",
    color: "from-cyan-500 to-blue-600",
  },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Recherchez",
    description:
      "Trouvez le médecin qui correspond à vos besoins parmi notre réseau",
  },
  {
    step: "02",
    title: "Réservez",
    description:
      "Choisissez votre créneau horaire parmi les disponibilités en temps réel",
  },
  {
    step: "03",
    title: "Consultez",
    description: "Recevez une confirmation et rendez-vous à votre consultation",
  },
] as const;
