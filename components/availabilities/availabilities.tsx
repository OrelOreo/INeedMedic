"use client";

import { DayOfWeek } from "@prisma/client";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { useActionState, useState } from "react";
import { AvailabilityFormState, createAvailability } from "@/lib/actions";
import { Separator } from "../ui/separator";

interface TimeSlot {
  start: string;
  end: string;
}

interface WeeklySchedule {
  [key: string]: TimeSlot[];
}

export default function Availabilities() {
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

  const [state, formAction] = useActionState(
    wrappedCreateAvailability,
    initialState
  );

  const [schedule, setSchedule] = useState<WeeklySchedule>({});

  const days: { key: DayOfWeek; label: string }[] = [
    { key: "MONDAY", label: "Lundi" },
    { key: "TUESDAY", label: "Mardi" },
    { key: "WEDNESDAY", label: "Mercredi" },
    { key: "THURSDAY", label: "Jeudi" },
    { key: "FRIDAY", label: "Vendredi" },
    { key: "SATURDAY", label: "Samedi" },
    { key: "SUNDAY", label: "Dimanche" },
  ];
  const addTimeSlot = (day: DayOfWeek) => {
    setSchedule({
      ...schedule,
      [day]: [...(schedule[day] || []), { start: "09:00", end: "17:00" }],
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
  return (
    <div className="grid gap-4">
      {days.map(({ key, label }) => (
        <Card key={key}>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <CardTitle className="text-lg">{label}</CardTitle>
              <Button
                onClick={() => addTimeSlot(key)}
                size="sm"
                className="cursor-pointer w-full sm:w-auto"
              >
                + Ajouter un créneau
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <form action={formAction}>
              <Input type="hidden" name="dayOfWeek" value={key} />
              {schedule[key]?.map((slot, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center mb-3"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-2 flex-1">
                    <Input
                      type="time"
                      name="startTime"
                      value={slot.start}
                      onChange={(e) =>
                        updateTimeSlot(key, index, "start", e.target.value)
                      }
                      className="w-full sm:w-32"
                    />
                    <span className="text-muted-foreground text-sm">à</span>
                    <Input
                      type="time"
                      name="endTime"
                      value={slot.end}
                      onChange={(e) =>
                        updateTimeSlot(key, index, "end", e.target.value)
                      }
                      className="w-full sm:w-32"
                    />
                    <Button
                      onClick={() => removeTimeSlot(key, index)}
                      variant="destructive"
                      size="sm"
                      className="cursor-pointer w-full sm:w-auto"
                    >
                      Supprimer
                    </Button>
                  </div>
                  <Separator className="my-2 sm:hidden" />
                </div>
              ))}
              {!schedule[key]?.length && (
                <p className="text-sm text-muted-foreground">
                  Aucun créneau défini
                </p>
              )}
              {schedule[key]?.length && (
                <Button
                  size="lg"
                  className="cursor-pointer mt-4 w-full sm:w-auto"
                >
                  Enregistrer
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
