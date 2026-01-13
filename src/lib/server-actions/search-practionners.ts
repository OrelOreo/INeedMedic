"use server";
import { prisma } from "@/db/prisma";

export async function searchPractionnersByLocationAndSpeciality(
  location: string,
  specialty: string
) {
  try {
    if (!location && !specialty) return [];
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
  } catch (error) {
    console.error("Error in searchPractionnersByLocationAndSpeciality:", error);
    return [];
  }
}
