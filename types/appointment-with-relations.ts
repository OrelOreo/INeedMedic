import { getAppointmentsByUser } from "@/lib/server-actions/index";

export type AppointmentWithRelations = Awaited<
  ReturnType<typeof getAppointmentsByUser>
>[0];
