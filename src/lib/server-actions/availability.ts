"use server";

import { prisma } from "@/db/prisma";
import { Availability, DayOfWeek } from "@prisma/client";
import { getSession } from "../helpers/auth-helpers";
import {
  AVAILABILITY_CREATION_SUCCESS_MESSAGE,
  AVAILABILITY_DELETION_ERROR_MESSAGE,
  AVAILABILITY_DELETION_SUCCESS_MESSAGE,
  END_TIME_AFTER_START_TIME_MESSAGE,
  END_TIME_REQUIRED_MESSAGE,
  GENERIC_ERROR_MESSAGE,
  NON_AUTHORIZED_ACTION,
  SESSION_NOT_FOUND_MESSAGE,
  START_TIME_REQUIRED_MESSAGE,
  TIME_SLOT_CONFLICT_MESSAGE,
} from "../helpers/messages-helpers";
import z from "zod";
import { revalidatePath } from "next/cache";
import { AvailabilityFormState } from "@/types/form-state/availabity-form-state";
import { type initialDeletionStateType } from "@/types/form-state/appointment-form-state";

const availabilityFormSchema = z
  .object({
    startTime: z.string().min(1, START_TIME_REQUIRED_MESSAGE),
    endTime: z.string().min(1, END_TIME_REQUIRED_MESSAGE),
    date: z.coerce.date(),
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
  date: Date,
  dayOfWeek: DayOfWeek,
  startTime: string,
  endTime: string
) {
  const existingAvailability = await prisma.availability.findFirst({
    where: {
      practitionerId: practitionerId,
      date: date, // Vérifier la même date exacte
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

  if (session.user.role !== "PRACTITIONER") {
    return {
      errors: {
        globalErrors: [NON_AUTHORIZED_ACTION],
      },
      message: null,
    };
  }

  const validatedFields = availabilityFormSchema.safeParse({
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    dayOfWeek: formData.get("dayOfWeek"),
    date: formData.get("date"),
  });

  if (!validatedFields.success) {
    const errorTree = z.treeifyError(validatedFields.error);

    return {
      errors: {
        startTime: errorTree.properties?.startTime?.errors,
        endTime: errorTree.properties?.endTime?.errors,
        dayOfWeek: errorTree.properties?.dayOfWeek?.errors,
        date: errorTree.properties?.date?.errors,
        globalErrors: errorTree.errors,
      },
      message: null,
    };
  }
  const { startTime, endTime, dayOfWeek, date } = validatedFields.data;
  try {
    const existingAvailability = await isAvailabilityOverlap(
      session.user.practitionerId!,
      date,
      dayOfWeek,
      startTime,
      endTime
    );
    if (existingAvailability) {
      return {
        errors: {
          globalErrors: [TIME_SLOT_CONFLICT_MESSAGE],
        },
        message: null,
      };
    }
    await prisma.availability.create({
      data: {
        practitionerId: session.user.practitionerId!,
        date,
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
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      throw new Error(NON_AUTHORIZED_ACTION);
    }
    const availabilities = await prisma.availability.findMany({
      where: {
        practitionerId: session?.user.practitionerId!,
      },
    });
    return availabilities;
  } catch (error) {
    console.error("Error in getAvailabilities:", error);
    return [];
  }
}

export async function deleteAvailability(
  prevState: initialDeletionStateType,
  availability: Availability
) {
  const session = await getSession();

  if (!session?.user?.id) {
    return {
      message: null,
      errors: { globalErrors: [NON_AUTHORIZED_ACTION] },
    };
  }

  if (session.user.practitionerId !== availability.practitionerId) {
    return {
      message: null,
      errors: { globalErrors: [NON_AUTHORIZED_ACTION] },
    };
  }

  try {
    await prisma.availability.delete({
      where: {
        id: availability.id,
        practitionerId: session.user.practitionerId!,
      },
    });
    revalidatePath("/dashboard/availability");
    return {
      message: AVAILABILITY_DELETION_SUCCESS_MESSAGE,
      errors: {},
    };
  } catch (error) {
    console.error(AVAILABILITY_DELETION_ERROR_MESSAGE, error);
    return {
      errors: {
        globalErrors: [GENERIC_ERROR_MESSAGE],
      },
      message: null,
    };
  }
}
