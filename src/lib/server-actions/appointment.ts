"use server";

import { AppointmentWithRelations } from "@/types/appointment-with-relations";
import { getSession } from "../helpers/auth-helpers";
import {
  APPOINTMENT_CANCELLATION_ERROR_MESSAGE,
  APPOINTMENT_CANCELLATION_SUCCESS_MESSAGE,
  APPOINTMENT_CREATION_ERROR_MESSAGE,
  APPOINTMENT_CREATION_SUCCESS_MESSAGE,
  NON_AUTHORIZED_ACTION,
} from "../helpers/messages-helpers";
import { prisma } from "@/db/prisma";
import { AppointmentStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function getWhereClauseForUser(): Promise<Prisma.AppointmentWhereInput> {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const practitionerId = session.user.practitionerId;
  const role = session.user.role;

  if (role === "PRACTITIONER") {
    return { practitionerId: practitionerId };
  } else if (role === "CLIENT") {
    return { clientId: userId };
  } else {
    throw new Error("Forbidden: unknown role");
  }
}

export async function getAppointmentsByUser() {
  try {
    const whereClause = await getWhereClauseForUser();
    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        client: {
          select: { name: true, email: true },
        },
        practitioner: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });
    return appointments;
  } catch (error) {
    console.error("Error in getAppointmentsByUser:", error);
    return [];
  }
}

export async function getAppointmentsCountByUser() {
  try {
    const whereClause = await getWhereClauseForUser();
    const count = await prisma.appointment.count({
      where: whereClause,
    });
    return count;
  } catch (error) {
    console.error("Error in getAppointmentsCountByUser:", error);
    return 0;
  }
}

export async function cancelAppointment(appointment: AppointmentWithRelations) {
  const session = await getSession();

  if (!session?.user?.id) {
    return { statut: "error", message: NON_AUTHORIZED_ACTION };
  }

  if (
    appointment.clientId !== session.user.id &&
    appointment.practitioner.userId !== session.user.id
  ) {
    return { statut: "error", message: NON_AUTHORIZED_ACTION };
  }

  const cancelledAtDateTime = new Date();
  try {
    await prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        status: AppointmentStatus.CANCELLED,
        cancelledAt: cancelledAtDateTime,
        cancelledBy: session.user.id,
      },
    });

    revalidatePath("/dashboard/appointments");
    return {
      statut: "success",
      message: APPOINTMENT_CANCELLATION_SUCCESS_MESSAGE,
    };
  } catch (error) {
    console.error("🚀 ~ cancelAppointment ~ error:", error);
    return {
      statut: "error",
      message: APPOINTMENT_CANCELLATION_ERROR_MESSAGE,
    };
  }
}

export async function createAppointment(
  practitionerId: string,
  appointmentDate: string,
  startTime: string,
  endTime: string,
  clientNotes?: string
) {
  const session = await getSession();

  if (!session?.user?.id) {
    return { statut: "error", message: NON_AUTHORIZED_ACTION };
  }

  try {
    await prisma.appointment.create({
      data: {
        practitionerId,
        clientId: session.user.id,
        date: appointmentDate,
        startTime,
        endTime,
        clientNotes,
      },
    });

    revalidatePath("/search");
    return {
      statut: "success",
      message: APPOINTMENT_CREATION_SUCCESS_MESSAGE,
    };
  } catch (error) {
    console.error("🚀 ~ createAppointment ~ error:", error);
    return {
      statut: "error",
      message: APPOINTMENT_CREATION_ERROR_MESSAGE,
    };
  }
}
