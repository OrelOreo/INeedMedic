
import z from "zod";

import { ADDRESS_REQUIRED_FOR_PRACTITIONER_MESSAGE, CITY_REQUIRED_FOR_PRACTITIONER_MESSAGE, EMAIL_INVALID_MESSAGE, EMAIL_MAX_LENGTH_MESSAGE, NAME_MAX_LENGTH_MESSAGE, NAME_MIN_LENGTH_MESSAGE, PASSWORD_MIN_LENGTH_MESSAGE, PASSWORDS_DO_NOT_MATCH_MESSAGE, PHONE_REQUIRED_FOR_PRACTITIONER_MESSAGE, REQUIRE_PASSWORD_MESSAGE, ROLE_REQUIRED_MESSAGE, SPECIALTY_REQUIRED_FOR_PRACTITIONER_MESSAGE } from "@/lib/helpers/messages-helpers";

const registerFormSchema = z
  .object({
    name: z.string().min(2, NAME_MIN_LENGTH_MESSAGE),
    email: z.email(EMAIL_INVALID_MESSAGE).toLowerCase(),
    password: z.string().min(8, PASSWORD_MIN_LENGTH_MESSAGE),
    confirmPassword: z.string().min(6, REQUIRE_PASSWORD_MESSAGE),
    role: z.enum(["CLIENT", "PRACTITIONER"], {
      message: ROLE_REQUIRED_MESSAGE,
    }),
    phone: z
      .string()
      .optional()
      .transform((val) => val?.replace(/[\s.-]/g, ""))
      .pipe(
        z
          .string()
          .regex(
            /^(?:(?:\+|00)33|0)[1-9](?:[0-9]{2}){4}$/,
            "Le numéro de téléphone doit être un numéro français valide"
          )
          .optional()
      ),
    address: z.string().optional(),
    city: z.string().optional(),
    specialty: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: PASSWORDS_DO_NOT_MATCH_MESSAGE,
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role === "PRACTITIONER") {
        return data.specialty && data.specialty.length > 0;
      }
      return true;
    },
    {
      message: SPECIALTY_REQUIRED_FOR_PRACTITIONER_MESSAGE,
      path: ["specialty"],
    }
  )
  .refine(
    (data) => {
      if (data.role === "PRACTITIONER") {
        return data.phone && data.phone.length > 0;
      }
      return true;
    },
    {
      message: PHONE_REQUIRED_FOR_PRACTITIONER_MESSAGE,
      path: ["phone"],
    }
  )
  .refine(
    (data) => {
      if (data.role === "PRACTITIONER") {
        return data.address && data.address.length > 0;
      }
      return true;
    },
    {
      message: ADDRESS_REQUIRED_FOR_PRACTITIONER_MESSAGE,
      path: ["address"],
    }
  )
  .refine(
    (data) => {
      if (data.role === "PRACTITIONER") {
        return data.city && data.city.length > 0;
      }
      return true;
    },
    {
      message: CITY_REQUIRED_FOR_PRACTITIONER_MESSAGE,
      path: ["city"],
    }
  );

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

export { userPasswordFormSchema, userProfileFormSchema, registerFormSchema}