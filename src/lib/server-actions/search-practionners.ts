"use server";
import { prisma } from "@/db/prisma";

export async function searchPractionnersByLocationAndSpeciality(
  city: string,
  specialty: string
) {
  const practitioners = await prisma.practitioner.findMany({
    where: {
      AND: [
        {
          city: {
            contains: city,
            mode: "insensitive",
          },
        },

        {
          specialty: {
            contains: specialty,
            mode: "insensitive",
          },
        },
      ],
    },
    include: {
      user: true,
      availabilities: true,
    },
  });

  return practitioners;
}
