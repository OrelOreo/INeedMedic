"use client";

import { Plus } from "lucide-react";
import { TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { DayOfWeek } from "@prisma/client";
import { createAvailability } from "@/lib/server-actions/index";
import { useActionState, useEffect } from "react";
import type { AvailabilitiesWithRelation } from "@/types/availabilities-with-relation";
import { toast } from "sonner";
import { useTimeSlots } from "@/hooks/useTimeSlots";
import { TimeSlotInput } from "./time-slot-input";
import { AvailabilityFormState } from "@/types/form-state/availabity-form-state";

interface AvailabilitiesTableRowProps {
  dayKey: DayOfWeek;
  dayLabel: string;
  availabilities: AvailabilitiesWithRelation[];
}

export default function AvailabilitiesTableRow({
  dayKey,
  dayLabel,
  availabilities,
}: AvailabilitiesTableRowProps) {
  const initialState: AvailabilityFormState = {
    message: null,
    errors: {},
  };

  const wrappedCreateAvailability = async (
    prevState: AvailabilityFormState | undefined,
    formData: FormData
  ) => {
    return createAvailability(prevState ?? initialState, formData);
  };

  const [state, formAction, isPending] = useActionState(
    wrappedCreateAvailability,
    initialState
  );

  const { slots, addSlot, removeSlot, updateSlot, deleteSlot } = useTimeSlots(
    dayKey,
    availabilities
  );

  useEffect(() => {
    if (state.message) {
      toast.success(state.message);
    }
    if (state.errors?.globalErrors) {
      toast.error(state.errors.globalErrors[0]);
    }
  }, [state]);

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{dayLabel}</div>
      </TableCell>

      <TableCell>
        <div className="space-y-2">
          {slots.map((slot, index) => (
            <form key={index} action={formAction}>
              <TimeSlotInput
                dayKey={dayKey}
                slot={slot}
                index={index}
                isPending={isPending}
                onUpdate={(field, value) => updateSlot(index, field, value)}
                onRemove={() => removeSlot(index)}
                onDelete={() => deleteSlot(index)}
              />
            </form>
          ))}

          {slots.length === 0 && (
            <div className="text-sm text-muted-foreground">Aucun créneau</div>
          )}
        </div>
      </TableCell>

      <TableCell className="text-right">
        <Button
          type="button"
          onClick={addSlot}
          variant="outline"
          size="sm"
          className="cursor-pointer"
          disabled={isPending}
        >
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </Button>
      </TableCell>
    </TableRow>
  );
}
