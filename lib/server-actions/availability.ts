"use server";

import { prisma } from "@/db/prisma";
import { DayOfWeek } from "@prisma/client";
import { getSession } from "../helpers/auth-helpers";
import {
  AVAILABILITY_CREATION_SUCCESS_MESSAGE,
  END_TIME_AFTER_START_TIME_MESSAGE,
  END_TIME_REQUIRED_MESSAGE,
  GENERIC_ERROR_MESSAGE,
  SESSION_NOT_FOUND_MESSAGE,
  START_TIME_REQUIRED_MESSAGE,
  TIME_SLOT_CONFLICT_MESSAGE,
} from "../helpers/messages-helpers";
import z from "zod";
import { revalidatePath } from "next/cache";
import { AvailabilityFormState } from "@/types/form-state/availabity-form-state";

const availabilityFormSchema = z
  .object({
    startTime: z.string().min(1, START_TIME_REQUIRED_MESSAGE),
    endTime: z.string().min(1, END_TIME_REQUIRED_MESSAGE),
    dayOfWeek: z.enum([
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ]),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: END_TIME_AFTER_START_TIME_MESSAGE,
  });

async function isAvailabilityOverlap(
  practitionerId: string,
  dayOfWeek: DayOfWeek,
  startTime: string,
  endTime: string
) {
  const existingAvailability = await prisma.availability.findFirst({
    where: {
      practitionerId: practitionerId,
      dayOfWeek,
      OR: [
        // Case 1: New slot starts during an existing slot
        {
          AND: [
            { startTime: { lte: startTime } },
            { endTime: { gt: startTime } },
          ],
        },
        // Case 2: New slot ends during an existing slot
        {
          AND: [{ startTime: { lt: endTime } }, { endTime: { gte: endTime } }],
        },
        // Case 3: New slot completely encompasses an existing slot
        {
          AND: [
            { startTime: { gte: startTime } },
            { endTime: { lte: endTime } },
          ],
        },
      ],
    },
  });
  return existingAvailability ? true : false;
}

export async function createAvailability(
  prevState: AvailabilityFormState,
  formData: FormData
) {
  const session = await getSession();

  if (!session?.user?.id) {
    return {
      errors: {
        globalErrors: [SESSION_NOT_FOUND_MESSAGE],
      },
      message: null,
    };
  }

  const validatedFields = availabilityFormSchema.safeParse({
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    dayOfWeek: formData.get("dayOfWeek"),
  });

  if (!validatedFields.success) {
    const errorTree = z.treeifyError(validatedFields.error);

    return {
      errors: {
        startTime: errorTree.properties?.startTime?.errors,
        endTime: errorTree.properties?.endTime?.errors,
        dayOfWeek: errorTree.properties?.dayOfWeek?.errors,
      },
      message: null,
    };
  }
  const { startTime, endTime, dayOfWeek } = validatedFields.data;
  try {
    const existingAvailability = await isAvailabilityOverlap(
      session.user.practitionerId!,
      dayOfWeek,
      startTime,
      endTime
    );
    if (existingAvailability) {
      return {
        errors: {
          startTime: [TIME_SLOT_CONFLICT_MESSAGE],
          endTime: [TIME_SLOT_CONFLICT_MESSAGE],
          dayOfWeek: [TIME_SLOT_CONFLICT_MESSAGE],
        },
        message: null,
      };
    }
    await prisma.availability.create({
      data: {
        practitionerId: session.user.practitionerId!,
        startTime,
        endTime,
        dayOfWeek,
      },
    });
    revalidatePath("/dashboard/availability");
    return {
      errors: {},
      message: AVAILABILITY_CREATION_SUCCESS_MESSAGE,
    };
  } catch (error) {
    console.error("Error ", error);
    return {
      errors: {
        globalErrors: [GENERIC_ERROR_MESSAGE],
      },
      message: null,
    };
  }
}

export async function getAvailabilities() {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const availabilities = await prisma.availability.findMany({
    where: {
      practitionerId: session?.user.practitionerId!,
    },
  });
  return availabilities;
}

export async function deleteAvailability(availabilityId: string) {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.availability.delete({
      where: {
        id: availabilityId,
        practitionerId: session.user.practitionerId!,
      },
    });
    revalidatePath("/dashboard/availability");
  } catch (error) {
    console.error("Error deleting availability:", error);
    throw new Error("Error deleting availability");
  }
}
