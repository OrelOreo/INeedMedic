"use server";

import z from "zod";
import {
  CURRENT_PASSWORD_INCORRECT_MESSAGE,
  GENERIC_ERROR_MESSAGE,
  PASSWORD_UPDATE_ERROR_MESSAGE,
  PASSWORD_UPDATE_SUCCESS_MESSAGE,
  REGISTRATION_SUCCESS_MESSAGE,
  SESSION_NOT_FOUND_MESSAGE,
} from "../helpers/messages-helpers";
import { findUserByEmail, findPasswordHashById, updatePasswordHash, createUser, updateUser } from "@/features/users/repository";
import { registerFormSchema, userPasswordFormSchema, userProfileFormSchema } from "@/features/users/validation";
import bcrypt from "bcryptjs";
import { getSession } from "../helpers/auth-helpers";
import {
  createCatchErrorMessage,
  createEmailExistsErrorMessage,
  createForbiddenErrorMessage,
  createUnauthorizedErrorMessage,
  createValidationErrorMessage,
  createValidationSuccessProfileMessage,
} from "../helpers/form-state-helpers";
import { revalidatePath } from "next/cache";
import { RegisterFormState } from "@/types/form-state/register-form-state";
import { FormInfosState } from "@/types/form-state/information-form-state";
import { FormUpdatePasswordState } from "@/types/form-state/password-update-form-state";


export async function isEmailExist(email: string) {
  try {
    const existingUser = await findUserByEmail(email)
    return existingUser ? true : false;
  } catch (error) {
    console.error("Error checking email existence:", error);
    return false;
  }
}

async function isPasswordValid(userId: string, password: string) {
  try {
    const user = await findPasswordHashById(userId)

    if (!user) {
      return false;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid;
  } catch (error) {
    return false;
  }
}

export async function registerUser(
  prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const specialtyValue = formData.get("specialty");
  const phoneValue = formData.get("phone");
  const addressValue = formData.get("address");
  const cityValue = formData.get("city");

  const validatedFields = registerFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    role: formData.get("role"),
    specialty:
      specialtyValue && specialtyValue !== "" ? specialtyValue : undefined,
    phone: phoneValue && phoneValue !== "" ? phoneValue : undefined,
    address: addressValue && addressValue !== "" ? addressValue : undefined,
    city: cityValue && cityValue !== "" ? cityValue : undefined,
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
        specialty: errorTree.properties?.specialty?.errors,
        phone: errorTree.properties?.phone?.errors,
        address: errorTree.properties?.address?.errors,
        city: errorTree.properties?.city?.errors,
      },
      message: null,
    };
  }
  const { name, email, password, role, specialty, phone, address, city } =
    validatedFields.data;
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
    await createUser(
      {
        name,
        email,
        passwordHash: hashedPassword,
        role,
      },
      role === "PRACTITIONER" && specialty
        ? { specialty, phone, address, city }
        : undefined
    );
    return {
      errors: {},
      message: REGISTRATION_SUCCESS_MESSAGE,
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

    if (emailExists && validatedFields.data.email !== session.user.email) {
      return createEmailExistsErrorMessage(prevState.id);
    }

    await updateUser({
      id: userId,
      name: validatedFields.data.name,
      email: validatedFields.data.email
    })

    revalidatePath("/profile");

    return createValidationSuccessProfileMessage(prevState.id);
  } catch (error) {
    return createCatchErrorMessage(prevState.id);
  }
}

export async function updateUserPassword(
  prevState: FormUpdatePasswordState,
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

    await updatePasswordHash({
      id: session.user.id,
      passwordHash: hashedNewPassword
    })

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
