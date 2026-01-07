import Availabilities from "@/components/availabilities/availabilities";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disponibilités",
};

export default function AvailabilityPage() {
  return (
    <main className="container mx-auto py-8 px-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Gérer mes disponibilités</h1>
      <Availabilities />
    </main>
  );
}
