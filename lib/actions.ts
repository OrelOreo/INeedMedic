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
} from "./helpers/validation-messages-helpers";
import {
  createForbiddenErrorMessage,
  createUnauthorizedErrorMessage,
  createEmailExistsErrorMessage,
  createValidationSuccessMessage,
  createValidationErrorMessage,
  createCatchErrorMessage,
} from "./helpers";

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

const registerSchema = z
  .object({
    name: z.string().min(2, NAME_MIN_LENGTH_MESSAGE),
    email: z.email(EMAIL_INVALID_MESSAGE),
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

    return createValidationSuccessMessage(prevState.id);
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
        globalErrors: ["Session non trouvée. Veuillez vous reconnecter."],
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
      message: "Échec de la validation. Veuillez vérifier vos données.",
    };
  }

  const { currentPassword, newPassword } = validatedFields.data;

  try {
    const isValid = await isPasswordValid(session.user.id, currentPassword);
    if (!isValid) {
      return {
        errors: {
          currentPassword: ["Le mot de passe actuel est incorrect"],
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
      message: "Mot de passe mis à jour avec succès",
    };
  } catch (error) {
    console.error("Error updating password:", error);
    return {
      errors: {
        globalErrors: [
          "Une erreur est survenue lors de la mise à jour du mot de passe",
        ],
      },
      message: null,
    };
  }
}

export async function registerUser(
  prevState: RegisterFormState,
  formData: FormData
) {
  const validatedFields = registerSchema.safeParse({
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
      message: "Échec de la validation. Veuillez vérifier vos données.",
    };
  }
  const { name, email, password, role } = validatedFields.data;
  try {
    const existingUser = await isEmailExist(email);
    if (existingUser) {
      return {
        errors: {
          globalErrors: ["Une erreur est survenue."],
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
      errors: undefined,
      message: "Inscription réussie. Vous pouvez maintenant vous connecter.",
    };
  } catch (error) {
    console.error("Error ", error);
    return {
      errors: {
        globalErrors: [
          "Une erreur est survenue lors de la mise à jour du mot de passe",
        ],
      },
      message: null,
    };
  }
}
