"use client";
import { useState } from "react";
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
import { toast } from "sonner";

import { PractionnersWithRelation } from "@/types/practionners-with-relation";
import { DayOfWeek } from "@prisma/client";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await createAppointment(
        selectedAppointment.practitioner.id,
        new Date().toISOString(),
        selectedAppointment.availability.startTime,
        selectedAppointment.availability.endTime,
        clientNotes
      );
      if (response.statut === "success") {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setClientNotes("");
      onClose();
      setIsSubmitting(false);
    }
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
                disabled={isSubmitting}
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={handleCancel}
              >
                Annuler
              </Button>
              <Button
                disabled={isSubmitting}
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
