import { getAppointmentsByUser } from "@/lib/data";

export type AppointmentWithRelations = Awaited<
  ReturnType<typeof getAppointmentsByUser>
>[0];
