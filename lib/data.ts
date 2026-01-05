import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";

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

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    throw new Error("Unauthorized");
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}
