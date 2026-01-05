"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/db/prisma";
import { z } from "zod";
import { getSession } from "./auth-helpers";
import {
  createForbiddenErrorMessage,
  createUnauthorizedErrorMessage,
  createEmailExistsErrorMessage,
  createValidationSuccessMessage,
  createValidationErrorMessage,
  createCatchErrorMessage,
} from "./helpers";

export type State = {
  id: string;
  errors?: {
    name?: string[];
    email?: string[];
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

async function isEmailExist(email: string, userId: string) {
  const existingUser = await prisma.user.findFirst({
    where: {
      email: email,
      NOT: { id: userId },
    },
  });
  return existingUser ? true : false;
}

export async function updateUserProfile(prevState: State, formData: FormData) {
  const session = await getSession();

  if (!session?.user?.id) {
    return createUnauthorizedErrorMessage(prevState.id);
    // return {
    //   id: prevState.id,
    //   message:
    //     "Non autorisé : Vous devez être connecté pour mettre à jour le profil",
    //   errors: {
    //     globalErrors: [
    //       "Non autorisé : Vous devez être connecté pour mettre à jour le profil",
    //     ],
    //   },
    // };
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
