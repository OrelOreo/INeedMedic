import z from "zod";
import { FormInfosState } from "./actions";

function createValidationResponse(
  id: string,
  message: string,
  errors: FormInfosState["errors"]
): FormInfosState {
  return { id, message, errors };
}

function createUnauthorizedErrorMessage(id: string): FormInfosState {
  return createValidationResponse(
    id,
    "Non autorisé : Vous devez être connecté pour mettre à jour le profil",
    {
      globalErrors: [
        "Non autorisé : Vous devez être connecté pour mettre à jour le profil",
      ],
    }
  );
}

function createForbiddenErrorMessage(id: string): FormInfosState {
  return createValidationResponse(
    id,
    "Interdit : Vous ne pouvez pas mettre à jour le profil d'un autre utilisateur",
    {
      globalErrors: [
        "Interdit : Vous ne pouvez pas mettre à jour le profil d'un autre utilisateur",
      ],
    }
  );
}

function createEmailExistsErrorMessage(id: string): FormInfosState {
  return createValidationResponse(
    id,
    "Une erreur est survenue lors de la mise à jour du profil.",
    {
      email: ["Une erreur est survenue lors de la mise à jour du profil."],
    }
  );
}

function createValidationErrorMessage(
  id: string,
  error: z.ZodError
): FormInfosState {
  const errorTree = z.treeifyError(error) as {
    errors: string[];
    properties?: Record<string, { errors: string[] }>;
  };
  return createValidationResponse(
    id,
    "Champs manquants. Échec de la mise à jour du profil.",
    {
      name: errorTree.properties?.name?.errors,
      email: errorTree.properties?.email?.errors,
    }
  );
}

function createValidationSuccessMessage(id: string): FormInfosState {
  return createValidationResponse(id, "Profil mis à jour avec succès.", {});
}

function createCatchErrorMessage(id: string): FormInfosState {
  return createValidationResponse(id, "Échec de la mise à jour du profil", {
    globalErrors: ["Échec de la mise à jour du profil"],
  });
}

export {
  createUnauthorizedErrorMessage,
  createForbiddenErrorMessage,
  createValidationErrorMessage,
  createEmailExistsErrorMessage,
  createValidationSuccessMessage,
  createCatchErrorMessage,
};
