import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Role } from "@prisma/client";
import { formatDate, formatTime } from "@/lib/utils";
import CancelAppointmentButton from "./cancel-appointment-button";
import type { AppointmentWithRelations } from "@/types/appointment-with-relations";
import {
  canCancelAppointment,
  getStatusBadgeVariant,
  getStatusLabel,
} from "@/lib/utils";

interface AppointmentTableRowProps {
  appointment: AppointmentWithRelations;
  role: Role;
}

export function AppointmentTableRow({
  appointment,
  role,
}: AppointmentTableRowProps) {
  const isPractitioner = role === "PRACTITIONER";

  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium">
            {isPractitioner
              ? appointment.client?.name
              : appointment.practitioner.user.name}
          </div>
          {appointment.practitioner?.specialty && !isPractitioner && (
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
        {appointment.practitioner?.address && !isPractitioner ? (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="max-w-xs truncate">
              {appointment.practitioner.address}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="max-w-xs truncate">{appointment.clientNotes}</span>
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
          <CancelAppointmentButton appointment={appointment} />
        )}
      </TableCell>
    </TableRow>
  );
}
