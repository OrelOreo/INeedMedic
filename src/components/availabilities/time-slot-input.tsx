"use client";

import { Clock, Check, X, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { DayOfWeek } from "@prisma/client";

interface TimeSlotInputProps {
  dayKey: DayOfWeek;
  slot: {
    start: string;
    end: string;
    isNew: boolean;
  };
  index: number;
  isPending: boolean;
  onUpdate: (field: "start" | "end", value: string) => void;
  onRemove: () => void;
  onDelete: () => void;
}

export function TimeSlotInput({
  dayKey,
  slot,
  index,
  isPending,
  onUpdate,
  onRemove,
  onDelete,
}: TimeSlotInputProps) {
  return (
    <div className="flex items-center gap-2">
      <Input type="hidden" name="dayOfWeek" value={dayKey} />

      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <Input
          type="time"
          name="startTime"
          value={slot.start}
          onChange={(e) => onUpdate("start", e.target.value)}
          className="w-32"
          disabled={isPending}
        />
        <span className="text-muted-foreground">à</span>
        <Input
          type="time"
          name="endTime"
          value={slot.end}
          onChange={(e) => onUpdate("end", e.target.value)}
          className="w-32"
          disabled={isPending}
        />
      </div>

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
        onClick={slot.isNew ? onRemove : onDelete}
        className="cursor-pointer"
        disabled={isPending}
      >
        {slot.isNew ? (
          <X className="h-4 w-4 text-destructive" />
        ) : (
          <Trash2 className="h-4 w-4 text-destructive" />
        )}
      </Button>
    </div>
  );
}
