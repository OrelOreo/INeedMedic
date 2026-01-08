"use client";

import { Button } from "../ui/button";
import { cancelAppointment } from "@/lib/server-actions/appointment";
import { toast } from "sonner";
import { useState } from "react";
import { AppointmentWithRelations } from "@/types/appointment-with-relations";

type CancelAppointmentButtonProps = {
  appointment: AppointmentWithRelations;
};

export default function CancelAppointmentButton({
  appointment,
}: CancelAppointmentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelAppointment = async () => {
    setIsLoading(true);
    try {
      const result = await cancelAppointment(appointment);

      if (result.statut === "success") {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCancelAppointment}
      variant="destructive"
      className="cursor-pointer"
      size="sm"
      disabled={isLoading}
    >
      {isLoading ? "Annulation..." : "Annuler le rendez-vous"}
    </Button>
  );
}
