"use server";

import { AppointmentWithRelations } from "@/types/appointment-with-relations";
import { getSession } from "../helpers/auth-helpers";
import {
  APPOINTMENT_CANCELLATION_ERROR_MESSAGE,
  APPOINTMENT_CANCELLATION_SUCCESS_MESSAGE,
  NON_AUTHORIZED_ACTION,
} from "../helpers/messages-helpers";
import { prisma } from "@/db/prisma";
import { AppointmentStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

async function getWhereClauseForUser(): Promise<Prisma.AppointmentWhereInput> {
  const session = await getServerSession(authOptions);

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
      startDateTime: "asc",
    },
  });

  return appointments;
}

export async function getAppointmentsCountByUser() {
  const whereClause = await getWhereClauseForUser();

  const count = await prisma.appointment.count({
    where: whereClause,
  });

  return count;
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
