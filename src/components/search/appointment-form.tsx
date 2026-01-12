"use client";
import { useActionState, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { PractionnersWithRelation } from "@/types/practionners-with-relation";
import { Availability, DayOfWeek } from "@prisma/client";
import { createAppointment } from "@/lib/server-actions";

type AppointmentFormProps = {
  selectedAppointment: {
    practitioner: PractionnersWithRelation;
    availability: PractionnersWithRelation["availabilities"][0];
  };
  days: { key: DayOfWeek; label: string }[];
  onClose: () => void;
};

export default function AppointmentForm({
  selectedAppointment,
  days,
  onClose,
}: AppointmentFormProps) {
  console.log(
    "🚀 ~ AppointmentForm ~ selectedAppointment.availability:",
    selectedAppointment.availability
  );
  const [clientNotes, setClientNotes] = useState("");

  const handleSubmitAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAppointment(
        selectedAppointment.practitioner.id,
        selectedAppointment.availability.startTime,
        selectedAppointment.availability.endTime,
        clientNotes
      );
      // Handle success (e.g., show a success message, refresh data, etc.)
      // onClose();
    } catch (error) {
      console.log("🚀 ~ handleSubmitAppointment ~ error:", error);
    }
    // setClientNotes("");
    // onClose();
  };

  const handleCancel = () => {
    setClientNotes("");
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Prendre rendez-vous</DialogTitle>
          <DialogDescription>
            Rendez-vous avec{" "}
            <strong>{selectedAppointment.practitioner.user.name}</strong>
            <br />
            {
              days.find(
                (d) => d.key === selectedAppointment.availability.dayOfWeek
              )?.label
            }{" "}
            à {selectedAppointment.availability.startTime}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <form className="space-y-4" onSubmit={handleSubmitAppointment}>
            <div className="space-y-2">
              <Label htmlFor="clientNotes">
                Notes ou raison de consultation (optionnel)
              </Label>
              <Textarea
                id="clientNotes"
                placeholder="Décrivez brièvement la raison de votre consultation..."
                name="clientNotes"
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
                className="min-h-25"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={handleCancel}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
              >
                Confirmer le rendez-vous
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
