"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { days, getUserNameInitials } from "@/lib/utils";
import type { PractionnersWithRelation } from "@/types/practionners-with-relation";
import { useState } from "react";
import AppointmentForm from "../appointments/appointment-form";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

type PractitionerListProps = {
  practitioners: PractionnersWithRelation[];
};

// Helper to get day label from a date string (YYYY-MM-DD)
function getDayLabelFromDate(dateInput: string | Date) {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  });
}

export default function PractitionerList({
  practitioners,
}: PractitionerListProps) {
  const session = useSession();
  const [selectedAppointment, setSelectedAppointment] = useState<{
    practitioner: PractionnersWithRelation;
    availability: PractionnersWithRelation["availabilities"][0];
  } | null>(null);

  const handleSelectAppointment = ({
    practitioner,
    availability,
  }: {
    practitioner: PractionnersWithRelation;
    availability: PractionnersWithRelation["availabilities"][0];
  }) => {
    if (!session.data) {
      redirect("/login");
    }
    setSelectedAppointment({
      ...selectedAppointment,
      practitioner,
      availability,
    });
  };

  return (
    <div className="grid gap-6 mt-6">
      {practitioners.map((practitioner) => {
        return (
          <Card key={practitioner.id} className="border border-emerald-100 ">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16 border-2 border-emerald-200">
                    <AvatarImage src={practitioner.user.image || undefined} />
                    <AvatarFallback className="bg-linear-to-br from-emerald-500 to-teal-600 text-white text-lg font-semibold">
                      {getUserNameInitials(practitioner.user.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <CardTitle className="text-2xl text-gray-900 mb-1">
                      {practitioner.user.name}
                    </CardTitle>
                    <CardDescription className="text-base">
                      <span className="text-emerald-700 font-semibold">
                        {practitioner.specialty}
                      </span>
                    </CardDescription>

                    <div className="flex items-center gap-2 mt-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm">{practitioner.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm">{practitioner.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm">{practitioner.user.email}</span>
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-3">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Disponibilités</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {practitioner.availabilities.length === 0 && (
                        <span className="text-gray-400 text-sm">
                          Aucune disponibilité
                        </span>
                      )}
                      {practitioner.availabilities
                        .filter(
                          (availability) =>
                            !practitioner.appointments?.some(
                              (appointment) =>
                                new Date(appointment.date).toISOString() ===
                                  new Date(availability.date).toISOString() &&
                                appointment.startTime ===
                                  availability.startTime &&
                                appointment.endTime === availability.endTime
                            )
                        )
                        .map((availability) => (
                          <div
                            key={availability.id}
                            className="flex flex-col items-center"
                          >
                            <span className="font-semibold text-xs text-gray-700 mb-1">
                              {getDayLabelFromDate(availability.date)}
                            </span>
                            <Button
                              aria-haspopup="dialog"
                              variant="outline"
                              size="sm"
                              className="h-8 px-2 cursor-pointer"
                              onClick={() =>
                                handleSelectAppointment({
                                  practitioner,
                                  availability,
                                })
                              }
                            >
                              {availability.startTime}
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {selectedAppointment && (
        <AppointmentForm
          selectedAppointment={selectedAppointment}
          days={days}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
}
