"use server";
import { prisma } from "@/db/prisma";

export async function searchPractionnersByLocationAndSpeciality(
  location: string,
  specialty: string
) {
  console.log(
    "🚀 ~ searchPractionnersByLocationAndSpeciality ~ specialty:",
    specialty
  );
  console.log(
    "🚀 ~ searchPractionnersByLocationAndSpeciality ~ location:",
    location
  );
  const practitioners = await prisma.practitioner.findMany({
    where: {
      AND: [
        {
          city: {
            contains: location,
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
      appointments: {
        select: {
          date: true,
          startTime: true,
          endTime: true,
        },
      },
    },
  });

  return practitioners;
}
