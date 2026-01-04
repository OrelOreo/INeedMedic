import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";

export async function getAppointmentsByUser() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const practitionerId = session.user.practitionerId;
  const role = session.user.role;

  let whereClause: Prisma.AppointmentWhereInput = {};

  if (role === "PRACTITIONER") {
    whereClause = { practitionerId: practitionerId };
  } else if (role === "CLIENT") {
    whereClause = { clientId: userId };
  } else {
    throw new Error("Forbidden: unknown role");
  }

  const appointments = await prisma.appointment.findMany({
    where: whereClause,
    include: {
      client: true,
      practitioner: true,
    },
    orderBy: {
      startDateTime: "asc",
    },
  });

  return appointments;
}
