import z from "zod";
import { FormInfosState } from "@/lib/server-actions/index";
import {
  GENERIC_ERROR_MESSAGE,
  NON_AUTHORIZED_ACTION,
  PROFILE_UPDATE_ERROR_MESSAGE,
  PROFILE_UPDATE_SUCCESS_MESSAGE,
} from "@/lib/helpers/messages-helpers";

function createValidationResponse(
  id: string,
  message: string | null,
  errors: FormInfosState["errors"]
): FormInfosState {
  return { id, message, errors };
}

function createUnauthorizedErrorMessage(id: string): FormInfosState {
  return createValidationResponse(id, null, {
    globalErrors: [NON_AUTHORIZED_ACTION],
  });
}

function createForbiddenErrorMessage(id: string): FormInfosState {
  return createValidationResponse(id, null, {
    globalErrors: [NON_AUTHORIZED_ACTION],
  });
}

function createEmailExistsErrorMessage(id: string): FormInfosState {
  return createValidationResponse(id, null, {
    email: [GENERIC_ERROR_MESSAGE],
  });
}

function createValidationErrorMessage(
  id: string,
  error: z.ZodError
): FormInfosState {
  const errorTree = z.treeifyError(error) as {
    errors: string[];
    properties?: Record<string, { errors: string[] }>;
  };
  return createValidationResponse(id, null, {
    name: errorTree.properties?.name?.errors,
    email: errorTree.properties?.email?.errors,
  });
}

function createValidationSuccessProfileMessage(id: string): FormInfosState {
  return createValidationResponse(id, PROFILE_UPDATE_SUCCESS_MESSAGE, {});
}

function createCatchErrorMessage(id: string): FormInfosState {
  return createValidationResponse(id, null, {
    globalErrors: [PROFILE_UPDATE_ERROR_MESSAGE],
  });
}

export {
  createUnauthorizedErrorMessage,
  createForbiddenErrorMessage,
  createValidationErrorMessage,
  createEmailExistsErrorMessage,
  createValidationSuccessProfileMessage,
  createCatchErrorMessage,
};
