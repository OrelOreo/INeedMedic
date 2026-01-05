import { getAppointmentsByUser } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";
import { AppointmentStatus } from "@prisma/client";
import { formatDate, formatTime } from "@/lib/utils";

export async function AppointmentsList() {
  const appointments = await getAppointmentsByUser();

  if (appointments.length === 0) {
    return <p className="text-gray-500">Aucun rendez-vous trouvé.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {appointments.map((appointment) => (
        <Card key={appointment.id}>
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate">
                  {appointment.practitioner.user.name}
                </CardTitle>
                {appointment.practitioner?.specialty && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {appointment.practitioner.specialty}
                  </p>
                )}
              </div>
              <Badge
                className="self-start shrink-0"
                variant={
                  appointment.status === AppointmentStatus.CONFIRMED
                    ? "default"
                    : appointment.status === AppointmentStatus.PENDING
                    ? "secondary"
                    : appointment.status === AppointmentStatus.CANCELLED
                    ? "destructive"
                    : "outline"
                }
              >
                {appointment.status === AppointmentStatus.CONFIRMED
                  ? "Confirmé"
                  : appointment.status === AppointmentStatus.PENDING
                  ? "En attente"
                  : appointment.status === AppointmentStatus.CANCELLED
                  ? "Annulé"
                  : appointment.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(appointment.startDateTime)}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{formatTime(appointment.startDateTime)}</span>
            </div>

            {appointment.practitioner?.address && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">
                  {appointment.practitioner.address}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
