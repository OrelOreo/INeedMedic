import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { deleteAvailability } from "@/lib/server-actions/index";
import { useActionState } from "react";
import { type initialDeletionStateType } from "@/types/form-state/appointment-form-state";

export function DeleteAvailability({ id }: { id: string }) {
  const initialState: initialDeletionStateType = {
    message: null,
    errors: {},
  };
  const deleteAvailabilityById = async (
    prevState: initialDeletionStateType,
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
