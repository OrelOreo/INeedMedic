"use client";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Plus } from "lucide-react";
import { useActionState, useMemo, useState } from "react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { fr } from "date-fns/locale";
import { type AvailabilityFormState } from "@/types/form-state/availabity-form-state";
import { createAvailability } from "@/lib/server-actions";
import { days } from "@/lib/utils";
import { Availability } from "@prisma/client";
import { DeleteAvailability } from "./buttons";

export default function AvailabilityCalendarForm({
  availabilities,
}: {
  availabilities: Availability[];
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

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

  const formatDateToLocal = (date: Date | undefined): string => {
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 20; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    slots.push("20:00");
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const getDayOfWeek = (date: Date | undefined): string => {
    if (!date) return "";

    return days[date.getDay()].key;
  };

  const existingSlots = useMemo(() => {
    if (!selectedDate) return [];

    const formattedDate = formatDateToLocal(selectedDate);
    return availabilities.filter(
      (availability) =>
        formatDateToLocal(new Date(availability.date)) === formattedDate
    );
  }, [selectedDate, availabilities]);

  return (
    <div className="flex flex-col gap-6">
      <Card className="border border-emerald-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            Sélectionner une date
          </CardTitle>
          <CardDescription>
            Choisissez la date pour laquelle vous souhaitez ajouter des créneaux
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            locale={fr}
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border border-emerald-100"
          />
        </CardContent>
      </Card>
      <Card className="border-2 border-emerald-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Clock className="w-5 h-5 text-emerald-600" />
            Ajouter un créneau
          </CardTitle>
          <CardDescription>
            {selectedDate ? (
              <>
                Pour le{" "}
                <span className="font-semibold text-emerald-700">
                  {selectedDate.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </>
            ) : (
              "Sélectionnez d'abord une date"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Affichage des créneaux existants */}
          {existingSlots.length > 0 && (
            <div className="mb-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="text-sm font-semibold text-emerald-800 mb-2">
                Créneaux déjà ajoutés :
              </h4>
              <div className="space-y-2">
                {existingSlots.map((slot) => (
                  <div key={slot.id}>
                    <div className="flex items-center gap-2 text-sm text-emerald-700">
                      <Clock className="w-4 h-4" />
                      <span>
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                    <DeleteAvailability id={slot.id} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <form action={formAction}>
            {/* Start Time */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="hidden"
                name="date"
                value={formatDateToLocal(selectedDate)}
              />
              <input
                type="hidden"
                name="dayOfWeek"
                value={getDayOfWeek(selectedDate)}
              />
              <input type="hidden" name="startTime" value={startTime} />
              <input type="hidden" name="endTime" value={endTime} />
              <div>
                <label
                  htmlFor="start-time"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Heure de début
                </label>
                <Select
                  name="start-time"
                  value={startTime}
                  onValueChange={setStartTime}
                >
                  <SelectTrigger
                    id="start-time"
                    className="border-2 border-gray-200 focus:border-emerald-500"
                  >
                    <SelectValue placeholder="--:--" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* End Time */}
              <div>
                <label
                  htmlFor="end-time"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Heure de fin
                </label>
                <Select
                  name="end-time"
                  value={endTime}
                  onValueChange={setEndTime}
                >
                  <SelectTrigger
                    id="end-time"
                    className="border-2 border-gray-200 focus:border-emerald-500"
                  >
                    <SelectValue placeholder="--:--" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full mt-4 cursor-pointer bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
              disabled={!selectedDate || !startTime || !endTime || isPending}
            >
              {isPending ? "Ajout en cours..." : "Ajouter le créneau"}
              <Plus className="w-4 h-4 mr-2" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
