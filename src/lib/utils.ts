import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AppointmentStatus, DayOfWeek } from "@prisma/client";
import type { AppointmentWithRelations } from "@/types/appointment-with-relations";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("fr-FR");
}

export function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function canCancelAppointment(
  appointment: AppointmentWithRelations
): boolean {
  const now = new Date();
  const appointmentDate = new Date(appointment.startDateTime);
  const hoursUntilAppointment =
    (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  const isFuture = appointmentDate > now;
  const isMoreThan24Hours = hoursUntilAppointment > 24;
  const isNotCancelled = appointment.status !== AppointmentStatus.CANCELLED;

  return isFuture && isMoreThan24Hours && isNotCancelled;
}

export function getStatusBadgeVariant(
  status: AppointmentStatus
): "default" | "secondary" | "destructive" | "outline" {
  const variants = {
    [AppointmentStatus.CONFIRMED]: "default",
    [AppointmentStatus.PENDING]: "secondary",
    [AppointmentStatus.CANCELLED]: "destructive",
    [AppointmentStatus.COMPLETED]: "outline",
  } as const;

  return variants[status] || "outline";
}

export function getStatusLabel(status: AppointmentStatus): string {
  const labels: Record<AppointmentStatus, string> = {
    [AppointmentStatus.CONFIRMED]: "Confirmé",
    [AppointmentStatus.PENDING]: "En attente",
    [AppointmentStatus.CANCELLED]: "Annulé",
    [AppointmentStatus.COMPLETED]: "Terminé",
  };

  return labels[status] || status;
}

export const getUserNameInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const days: { key: DayOfWeek; label: string }[] = [
  { key: "MONDAY", label: "Lundi" },
  { key: "TUESDAY", label: "Mardi" },
  { key: "WEDNESDAY", label: "Mercredi" },
  { key: "THURSDAY", label: "Jeudi" },
  { key: "FRIDAY", label: "Vendredi" },
  { key: "SATURDAY", label: "Samedi" },
  { key: "SUNDAY", label: "Dimanche" },
];
