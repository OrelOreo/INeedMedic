export type FormInfosState = {
  id: string;
  errors?: {
    name?: string[];
    email?: string[];
    globalErrors?: string[];
  };
  message?: string | null;
};
