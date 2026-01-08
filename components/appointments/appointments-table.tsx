import { getAppointmentsByUser } from "@/lib/server-actions/index";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCurrentRole } from "@/lib/helpers/auth-helpers";
import { redirect } from "next/navigation";
import { AppointmentTableRow } from "./appointments-table-row";

export async function AppointmentsTable() {
  const role = await getCurrentRole();
  if (!role) {
    redirect("/login");
  }

  const appointments = await getAppointmentsByUser();

  if (appointments.length === 0) {
    return <p className="text-gray-500">Aucun rendez-vous trouvé.</p>;
  }

  const isPractitioner = role === "PRACTITIONER";

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{isPractitioner ? "Patient" : "Praticien"}</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Heure</TableHead>
            <TableHead>
              {isPractitioner ? "Note du patient" : "Adresse"}
            </TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <AppointmentTableRow
              key={appointment.id}
              appointment={appointment}
              role={role}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
