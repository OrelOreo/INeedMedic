export type FormUpdatePasswordState = {
  errors?: {
    currentPassword?: string[];
    newPassword?: string[];
    confirmPassword?: string[];
    globalErrors?: string[];
  };
  message?: string | null;
};
