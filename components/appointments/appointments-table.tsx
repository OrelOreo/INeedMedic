import { getAppointmentsByUser } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Clock, MapPin } from "lucide-react";
import { AppointmentStatus } from "@prisma/client";
import { formatDate, formatTime } from "@/lib/utils";
import { Button } from "../ui/button";

export async function AppointmentsTable() {
  const appointments = await getAppointmentsByUser();

  const canCancelAppointment = (appointment: (typeof appointments)[0]) => {
    const now = new Date();
    const appointmentDate = new Date(appointment.startDateTime);
    const hoursUntilAppointment =
      (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    const isFuture = appointmentDate > now;
    const isMoreThan24Hours = hoursUntilAppointment > 24;
    const isNotCancelled = appointment.status !== AppointmentStatus.CANCELLED;

    return isFuture && isMoreThan24Hours && isNotCancelled;
  };

  const getStatusBadgeVariant = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.CONFIRMED:
        return "default";
      case AppointmentStatus.PENDING:
        return "secondary";
      case AppointmentStatus.CANCELLED:
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.CONFIRMED:
        return "Confirmé";
      case AppointmentStatus.PENDING:
        return "En attente";
      case AppointmentStatus.CANCELLED:
        return "Annulé";
      default:
        return status;
    }
  };

  if (appointments.length === 0) {
    return <p className="text-gray-500">Aucun rendez-vous trouvé.</p>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Praticien</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Heure</TableHead>
            <TableHead>Adresse</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {appointment.practitioner.user.name}
                  </div>
                  {appointment.practitioner?.specialty && (
                    <div className="text-sm text-muted-foreground">
                      {appointment.practitioner.specialty}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(appointment.startDateTime)}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{formatTime(appointment.startDateTime)}</span>
                </div>
              </TableCell>
              <TableCell>
                {appointment.practitioner?.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="max-w-xs truncate">
                      {appointment.practitioner.address}
                    </span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(appointment.status)}>
                  {getStatusLabel(appointment.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {canCancelAppointment(appointment) && (
                  <Button
                    variant="destructive"
                    className="cursor-pointer"
                    size="sm"
                  >
                    Annuler
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
