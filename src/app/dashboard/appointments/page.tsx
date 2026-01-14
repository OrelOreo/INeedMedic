export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { AppointmentsTable } from "@/components/appointments/appointments-table";
import { getAppointmentsCountByUser } from "@/lib/server-actions/index";
import { AppointmentsTableSkeleton } from "@/components/ui/appointments-table-skeleton";

export default async function AppointmentsPage() {
  const countOfAppointments = await getAppointmentsCountByUser();
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mes Rendez-vous</h1>

      <Suspense
        fallback={
          <>
            <AppointmentsTableSkeleton
              countOfAppointments={countOfAppointments}
            />
          </>
        }
      >
        <AppointmentsTable />
      </Suspense>
    </main>
  );
}
