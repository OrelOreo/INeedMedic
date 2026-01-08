"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/db/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getSession } from "./helpers/auth-helpers";
import {
  REQUIRE_PASSWORD_MESSAGE,
  PASSWORDS_DO_NOT_MATCH_MESSAGE,
  NAME_MIN_LENGTH_MESSAGE,
  EMAIL_INVALID_MESSAGE,
  PASSWORD_MIN_LENGTH_MESSAGE,
  ROLE_REQUIRED_MESSAGE,
  EMAIL_MAX_LENGTH_MESSAGE,
  NAME_MAX_LENGTH_MESSAGE,
  SESSION_NOT_FOUND_MESSAGE,
  CURRENT_PASSWORD_INCORRECT_MESSAGE,
  PASSWORD_UPDATE_SUCCESS_MESSAGE,
  PASSWORD_UPDATE_ERROR_MESSAGE,
  GENERIC_ERROR_MESSAGE,
  REGISTRATION_SUCCESS_MESSAGE,
  APPOINTMENT_CANCELLATION_ERROR_MESSAGE,
  APPOINTMENT_CANCELLATION_SUCCESS_MESSAGE,
  NON_AUTHORIZED_ACTION,
  START_TIME_REQUIRED_MESSAGE,
  END_TIME_REQUIRED_MESSAGE,
  END_TIME_AFTER_START_TIME_MESSAGE,
  TIME_SLOT_CONFLICT_MESSAGE,
  AVAILABILITY_CREATION_SUCCESS_MESSAGE,
} from "./helpers/messages-helpers";
import {
  createForbiddenErrorMessage,
  createUnauthorizedErrorMessage,
  createEmailExistsErrorMessage,
  createValidationSuccessProfileMessage,
  createValidationErrorMessage,
  createCatchErrorMessage,
} from "@/lib/helpers/form-state-helpers";
import { AppointmentStatus, DayOfWeek } from "@prisma/client";
import type { AppointmentWithRelations } from "@/types/appointment-with-relations";

export type FormInfosState = {
  id: string;
  errors?: {
    name?: string[];
    email?: string[];
    globalErrors?: string[];
  };
  message?: string | null;
};

export type FormPasswordState = {
  errors?: {
    currentPassword?: string[];
    newPassword?: string[];
    confirmPassword?: string[];
    globalErrors?: string[];
  };
  message?: string | null;
};

export type RegisterFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    role?: string[];
    globalErrors?: string[];
  };
  message?: string | null;
};

export type AvailabilityFormState = {
  errors?: {
    startTime?: string[];
    endTime?: string[];
    dayOfWeek?: string[];
    globalErrors?: string[];
  };
  message?: string | null;
};

const userProfileFormSchema = z.object({
  name: z
    .string()
    .min(2, NAME_MIN_LENGTH_MESSAGE)
    .max(30, NAME_MAX_LENGTH_MESSAGE),
  email: z
    .email(EMAIL_INVALID_MESSAGE)
    .max(30, EMAIL_MAX_LENGTH_MESSAGE)
    .toLowerCase(),
});

const userPasswordFormSchema = z
  .object({
    currentPassword: z.string().min(6, REQUIRE_PASSWORD_MESSAGE),
    newPassword: z.string().min(6, REQUIRE_PASSWORD_MESSAGE),
    confirmPassword: z.string().min(6, REQUIRE_PASSWORD_MESSAGE),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: PASSWORDS_DO_NOT_MATCH_MESSAGE,
    path: ["confirmPassword"],
  });

const registerFormSchema = z
  .object({
    name: z.string().min(2, NAME_MIN_LENGTH_MESSAGE),
    email: z.email(EMAIL_INVALID_MESSAGE).toLowerCase(),
    password: z.string().min(8, PASSWORD_MIN_LENGTH_MESSAGE),
    confirmPassword: z.string().min(6, REQUIRE_PASSWORD_MESSAGE),
    role: z.enum(["CLIENT", "PRACTITIONER"], {
      message: ROLE_REQUIRED_MESSAGE,
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: PASSWORDS_DO_NOT_MATCH_MESSAGE,
    path: ["confirmPassword"],
  });

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

async function isEmailExist(email: string) {
  const existingUser = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  return existingUser ? true : false;
}

async function isPasswordValid(userId: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      return false;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid;
  } catch (error) {
    return false;
  }
}

export async function updateUserProfile(
  prevState: FormInfosState,
  formData: FormData
) {
  const session = await getSession();

  if (!session?.user?.id) {
    return createUnauthorizedErrorMessage(prevState.id);
  }

  const userId = prevState.id;

  if (session.user.id !== userId) {
    return createForbiddenErrorMessage(prevState.id);
  }

  const validatedFields = userProfileFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return createValidationErrorMessage(prevState.id, validatedFields.error);
  }

  try {
    const emailExists = await isEmailExist(validatedFields.data.email);

    if (emailExists) {
      return createEmailExistsErrorMessage(prevState.id);
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: validatedFields.data.name,
        email: validatedFields.data.email,
      },
    });

    revalidatePath("/profile");

    return createValidationSuccessProfileMessage(prevState.id);
  } catch (error) {
    return createCatchErrorMessage(prevState.id);
  }
}

export async function updateUserPassword(
  prevState: FormPasswordState,
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

  const validatedFields = userPasswordFormSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    const errorTree = z.treeifyError(validatedFields.error);
    return {
      errors: {
        currentPassword: errorTree.properties?.currentPassword?.errors,
        newPassword: errorTree.properties?.newPassword?.errors,
        confirmPassword: errorTree.properties?.confirmPassword?.errors,
      },
      message: null,
    };
  }

  const { currentPassword, newPassword } = validatedFields.data;

  try {
    const isValid = await isPasswordValid(session.user.id, currentPassword);
    if (!isValid) {
      return {
        errors: {
          currentPassword: [CURRENT_PASSWORD_INCORRECT_MESSAGE],
        },
        message: null,
      };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedNewPassword },
    });

    return {
      errors: undefined,
      message: PASSWORD_UPDATE_SUCCESS_MESSAGE,
    };
  } catch (error) {
    console.error("Error updating password:", error);
    return {
      errors: {
        globalErrors: [PASSWORD_UPDATE_ERROR_MESSAGE],
      },
      message: null,
    };
  }
}

export async function registerUser(
  prevState: RegisterFormState,
  formData: FormData
) {
  const validatedFields = registerFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    role: formData.get("role"),
  });

  if (!validatedFields.success) {
    const errorTree = z.treeifyError(validatedFields.error);
    return {
      errors: {
        name: errorTree.properties?.name?.errors,
        email: errorTree.properties?.email?.errors,
        password: errorTree.properties?.password?.errors,
        confirmPassword: errorTree.properties?.confirmPassword?.errors,
        role: errorTree.properties?.role?.errors,
      },
      message: null,
    };
  }
  const { name, email, password, role } = validatedFields.data;
  try {
    const existingUser = await isEmailExist(email);
    if (existingUser) {
      return {
        errors: {
          globalErrors: [GENERIC_ERROR_MESSAGE],
        },
        message: null,
      };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });
    return {
      errors: {},
      message: REGISTRATION_SUCCESS_MESSAGE,
    };
  } catch (error) {
    console.error("Error ", error);
    return {
      errors: {
        globalErrors: [PASSWORD_UPDATE_ERROR_MESSAGE],
      },
      message: null,
    };
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

export async function isAvailabilityOverlap(
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
