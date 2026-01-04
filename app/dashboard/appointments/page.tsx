import { Suspense } from "react";
import { AppointmentsList } from "@/components/appointments/appointment-card";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import { getAppointmentsCountByUser } from "@/lib/data";

export default async function AppointmentsPage() {
  const countOfAppointments = await getAppointmentsCountByUser();
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mes Rendez-vous</h1>

      <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: countOfAppointments }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <AppointmentsList />
      </Suspense>
    </div>
  );
}
