"use client";

import { Check, Clock, Plus, Trash2, X } from "lucide-react";
import { Input } from "../ui/input";
import { TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { DayOfWeek } from "@prisma/client";
import { AvailabilityFormState, createAvailability } from "@/lib/actions";
import { useActionState, useEffect, useState } from "react";
import type { AvailabilitiesWithRelation } from "@/types/availabilities-with-relation";

interface TimeSlot {
  start: string;
  end: string;
  isNew?: boolean;
}

interface WeeklySchedule {
  [key: string]: TimeSlot[];
}

export default function AvailabilitiesTableRow({
  dayKey: key,
  dayLabel: label,
  availabilities,
}: {
  dayKey: DayOfWeek;
  dayLabel: string;
  availabilities: AvailabilitiesWithRelation[];
}) {
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
  console.log("🚀 ~ AvailabilitiesTableRow ~ isPending:", isPending);

  const [schedule, setSchedule] = useState<WeeklySchedule>({});

  const addTimeSlot = (day: DayOfWeek) => {
    setSchedule({
      ...schedule,
      [day]: [
        ...(schedule[day] || []),
        { start: "09:00", end: "17:00", isNew: true },
      ],
    });
  };

  const removeTimeSlot = (day: DayOfWeek, index: number) => {
    const updatedSlots = schedule[day].filter((_, i) => i !== index);
    setSchedule({ ...schedule, [day]: updatedSlots });
  };

  const updateTimeSlot = (
    day: DayOfWeek,
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    const updatedSlots = [...schedule[day]];
    updatedSlots[index][field] = value;
    setSchedule({ ...schedule, [day]: updatedSlots });
  };

  useEffect(() => {
    const dayAvailabilities = availabilities
      .filter((availability) => availability.dayOfWeek === key)
      .map((availability) => ({
        start: availability.startTime,
        end: availability.endTime,
        isNew: false,
      }));

    if (dayAvailabilities.length > 0) {
      setSchedule({ [key]: dayAvailabilities });
    }
  }, [availabilities, key]);

  return (
    <TableRow key={key}>
      <TableCell>
        <div className="font-medium">{label}</div>
      </TableCell>
      <TableCell>
        <div className="space-y-2">
          {schedule[key]?.map((slot, index) => (
            <form key={index} action={formAction}>
              <Input type="hidden" name="dayOfWeek" value={key} />
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="time"
                    name="startTime"
                    value={slot.start}
                    onChange={(e) =>
                      updateTimeSlot(key, index, "start", e.target.value)
                    }
                    className="w-32"
                  />
                  <span className="text-muted-foreground">à</span>
                  <Input
                    type="time"
                    name="endTime"
                    value={slot.end}
                    onChange={(e) =>
                      updateTimeSlot(key, index, "end", e.target.value)
                    }
                    className="w-32"
                  />
                </div>

                {slot.isNew ? (
                  <>
                    <Button
                      type="submit"
                      size="sm"
                      variant="default"
                      className="cursor-pointer"
                      disabled={isPending}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      onClick={() => removeTimeSlot(key, index)}
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      disabled={isPending}
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="submit"
                      size="sm"
                      variant="default"
                      className="cursor-pointer"
                      disabled={isPending}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </>
                )}
              </div>
            </form>
          ))}
          {!schedule[key]?.length && (
            <div className="text-sm text-muted-foreground">Aucun créneau</div>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <Button
          type="button"
          onClick={() => addTimeSlot(key)}
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
