import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { deleteAvailability } from "@/lib/server-actions/index";
import { useActionState } from "react";
import { type initialDeletionStateType } from "@/types/form-state/appointment-form-state";
import { Availability } from "@prisma/client";
import { Spinner } from "../ui/spinner";

export function DeleteAvailability({
  availability,
}: {
  availability: Availability;
}) {
  const initialState: initialDeletionStateType = {
    message: null,
    errors: {},
  };
  const deleteAvailabilityAction = async (
    prevState: initialDeletionStateType,
    formData: FormData
  ) => {
    return await deleteAvailability(prevState, availability);
  };

  const [state, formAction, isPending] = useActionState(
    deleteAvailabilityAction,
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
        {isPending ? (
          <Spinner className="ml-2" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </Button>
    </form>
  );
}
