import Availabilities from "@/components/availabilities/availabilities-table";
import { Metadata } from "next";
import { Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Disponibilités",
};

export default function AvailabilityPage() {
  return (
    <main className="container mx-auto py-8 px-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Gérer mes disponibilités</h1>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-semibold mb-2">
            Comment remplir vos créneaux de disponibilité ?
          </p>
          <p className="mb-2">
            Ajoutez vos créneaux horaires pour chaque jour de la semaine. Vous
            pouvez créer plusieurs créneaux par jour.
          </p>
          <p className="font-medium">Exemple pour un lundi :</p>
          <ul className="list-disc list-inside ml-2 mt-1">
            <li>10:00 - 10:30</li>
            <li>10:30 - 11:00</li>
            <li>13:30 - 14:00</li>
          </ul>
        </div>
      </div>

      <Availabilities />
    </main>
  );
}
