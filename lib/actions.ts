"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/db/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getSession } from "./auth-helpers";
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

const userProfileFormSchema = z.object({
  name: z.string().min(2, "Nom requis").max(30, "Nom trop long").trim(),
  email: z
    .email("Adresse e-mail invalide")
    .max(30, "Email trop long")
    .toLowerCase(),
});

const userPasswordFormSchema = z
  .object({
    currentPassword: z.string().min(6, "Mot de passe actuel requis"),
    newPassword: z.string().min(6, "Nouveau mot de passe requis"),
    confirmPassword: z.string().min(6, "Confirmation du mot de passe requise"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

async function isEmailExist(email: string, userId: string) {
  const existingUser = await prisma.user.findFirst({
    where: {
      email: email,
      NOT: { id: userId },
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
    console.log("Error checking password validity:", error);
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
    const emailExists = await isEmailExist(validatedFields.data.email, userId);

    if (!emailExists) {
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
): Promise<FormPasswordState> {
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

    // revalidatePath("/profile");

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
