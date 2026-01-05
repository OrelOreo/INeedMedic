"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/db/prisma";
import { z } from "zod";
import { getSession } from "./auth-helpers";

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
  name: z.string().min(2, "Name is required").max(30, "Name too long").trim(),
  email: z
    .email("Invalid email address")
    .max(30, "Email too long")
    .toLowerCase(),
});

export async function updateUserProfile(prevState: State, formData: FormData) {
  const session = await getSession();

  if (!session?.user?.id) {
    return {
      id: prevState.id,
      message: "Unauthorized: You must be logged in",
      errors: {
        globalErrors: ["Unauthorized: You must be logged in"],
      },
    };
  }

  const userId = prevState.id;

  if (session.user.id !== userId) {
    return {
      id: prevState.id,
      message: "Forbidden: You can only update your own profile",
      errors: {
        globalErrors: ["Forbidden: You can only update your own profile"],
      },
    };
  }

  const validatedFields = userProfileFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    const errorTree = z.treeifyError(validatedFields.error);
    return {
      id: prevState.id,
      message: "Missing fields. Failed to update profile.",
      errors: {
        name: errorTree.properties?.name?.errors,
        email: errorTree.properties?.email?.errors,
      },
    };
  }

  try {
    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    const existingUser = await prisma.user.findFirst({
      where: {
        email: validatedFields.data.email,
        NOT: { id: userId },
      },
    });

    if (existingUser) {
      return {
        id: prevState.id,
        message: "Une erreur est survenue lors de la mise à jour du profil.",
        errors: {
          globalErrors: [
            "Une erreur est survenue lors de la mise à jour du profil..",
          ],
        },
      };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: validatedFields.data.name,
        email: validatedFields.data.email,
      },
    });

    revalidatePath("/profile");

    return {
      id: prevState.id,
      message: "Profile updated successfully",
      errors: {},
    };
  } catch (error) {
    return {
      id: prevState.id,
      message: "Failed to update user profile",
      errors: {
        globalErrors: ["Failed to update user profile"],
      },
    };
  }
}
