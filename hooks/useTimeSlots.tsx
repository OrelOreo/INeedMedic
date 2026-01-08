import { useState, useEffect } from "react";
import { DayOfWeek } from "@prisma/client";
import type { AvailabilitiesWithRelation } from "@/types/availabilities-with-relation";
import { deleteAvailability } from "@/lib/actions";
import { toast } from "sonner";
import {
  AVAILABILITY_DELETION_ERROR_MESSAGE,
  AVAILABILITY_DELETION_SUCCESS_MESSAGE,
} from "@/lib/helpers/messages-helpers";

interface TimeSlot {
  id?: string;
  start: string;
  end: string;
  isNew: boolean;
}

export function useTimeSlots(
  dayKey: DayOfWeek,
  availabilities: AvailabilitiesWithRelation[]
) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    const dayAvailabilities = availabilities
      .filter((availability) => availability.dayOfWeek === dayKey)
      .map((availability) => ({
        id: availability.id,
        start: availability.startTime,
        end: availability.endTime,
        isNew: false,
      }));

    setSlots(dayAvailabilities);
  }, [availabilities, dayKey]);

  const addSlot = () => {
    setSlots((prev) => [
      ...prev,
      { start: "09:00", end: "17:00", isNew: true },
    ]);
  };

  const removeSlot = (index: number) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSlot = (index: number, field: "start" | "end", value: string) => {
    setSlots((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const deleteSlot = async (index: number) => {
    const slot = slots[index];
    if (!slot.id) return;

    try {
      await deleteAvailability(slot.id);
      removeSlot(index);
      toast.success(AVAILABILITY_DELETION_SUCCESS_MESSAGE);
    } catch (error) {
      console.error("Error deleting availability:", error);
      toast.error(AVAILABILITY_DELETION_ERROR_MESSAGE);
    }
  };

  return {
    slots,
    addSlot,
    removeSlot,
    updateSlot,
    deleteSlot,
  };
}
