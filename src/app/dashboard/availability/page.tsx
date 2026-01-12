import AvailabilityCalendarForm from "@/components/availabilities/availability-calendar-form";
import { Metadata } from "next";
import { getAvailabilities } from "@/lib/server-actions";

export const metadata: Metadata = {
  title: "Disponibilités",
};

export default async function AvailabilityPage() {
  const availabilities = await getAvailabilities();
  return (
    <main className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gérer mes disponibilités
        </h1>
        <p className="text-lg text-gray-600">
          Définissez vos créneaux horaires disponibles pour les patients
        </p>
      </div>
      <AvailabilityCalendarForm availabilities={availabilities} />
    </main>
  );
}
