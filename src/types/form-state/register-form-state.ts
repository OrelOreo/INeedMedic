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
