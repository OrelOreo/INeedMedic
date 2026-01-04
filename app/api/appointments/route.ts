import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    return NextResponse.json(
      { error: "Forbidden: unknown role" },
      { status: 403 }
    );
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

  return NextResponse.json({ appointments });
}
