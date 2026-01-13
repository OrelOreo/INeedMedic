import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { deleteAvailability } from "@/lib/server-actions/index";
import { useActionState } from "react";

type initialStateType = {
  message?: string | null;
  errors?: {
    globalErrors?: string[];
  };
};

export function DeleteAvailability({ id }: { id: string }) {
  const initialState: initialStateType = {
    message: null,
    errors: {},
  };
  const deleteAvailabilityById = async (
    prevState: initialStateType,
    formData: FormData
  ) => {
    return await deleteAvailability(prevState, id);
  };

  const [state, formAction, isPending] = useActionState(
    deleteAvailabilityById,
    initialState
  );
  return (
    <form action={formAction}>
      <Button
        variant="destructive"
        className="my-2 cursor-pointer"
        disabled={isPending}
      >
        Supprimer ce créneau
        <Trash2 className="w-4 h-4" />
      </Button>
    </form>
  );
}
