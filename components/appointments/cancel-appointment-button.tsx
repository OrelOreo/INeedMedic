"use client";

import { Appointment } from "@prisma/client";
import { Button } from "../ui/button";
import { cancelAppointment } from "@/lib/actions";
import { toast } from "sonner";
import { useState } from "react";

type CancelAppointmentButtonProps = {
  appointment: Appointment;
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
