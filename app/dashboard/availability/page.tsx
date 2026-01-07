"use client";

import { useActionState, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createAvailability } from "@/lib/actions";
import { DayOfWeek } from "@prisma/client";

interface TimeSlot {
  start: string;
  end: string;
}

interface WeeklySchedule {
  [key: string]: TimeSlot[];
}

export default function AvailabilityPage() {
  const initialState = {
    statut: "",
    message: "",
  };
  //   const updateUserProfileWithId = async (
  //     prevState: any,
  //     formData: FormData
  //   ) => {
  //     return createAvailability(prevState, formData);
  //   };
  const [state, formAction] = useActionState(createAvailability, initialState);
  //   const [date, setDate] = useState<Date | undefined>(new Date());
  //   const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [schedule, setSchedule] = useState<WeeklySchedule>({});
  //   const [consultationDuration, setConsultationDuration] = useState(30);

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

  //   const toggleBlockedDate = (selectedDate: Date) => {
  //     const isBlocked = blockedDates.some(
  //       (d) => d.toDateString() === selectedDate.toDateString()
  //     );

  //     if (isBlocked) {
  //       setBlockedDates(
  //         blockedDates.filter(
  //           (d) => d.toDateString() !== selectedDate.toDateString()
  //         )
  //       );
  //     } else {
  //       setBlockedDates([...blockedDates, selectedDate]);
  //     }
  //   };

  return (
    <main className="container mx-auto py-8 px-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Gérer mes disponibilités</h1>

      <div className="grid gap-4">
        {days.map(({ key, label }) => (
          <Card key={key}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{label}</CardTitle>
                <Button onClick={() => addTimeSlot(key)} size="sm">
                  + Ajouter un créneau
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <form action={formAction}>
                <Input type="hidden" name="dayOfWeek" value={key} />
                {schedule[key]?.map((slot, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    {/* <p>{JSON.stringify(key)}</p> */}
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

                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={() => removeTimeSlot(key, index)}
                        variant="destructive"
                        size="sm"
                      >
                        Supprimer
                      </Button>
                      <Button size="lg">Enregistrer les disponibilités</Button>
                    </div>
                  </div>
                ))}
                {!schedule[key]?.length && (
                  <p className="text-sm text-muted-foreground">
                    Aucun créneau défini
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* <div className="mt-6 flex justify-end">
        <Button size="lg">Enregistrer les disponibilités</Button>
      </div> */}
    </main>
  );
}
