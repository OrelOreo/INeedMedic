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
import AppointmentForm from "./appointment-form";

type PractitionerListProps = {
  practitioners: PractionnersWithRelation[];
};

// Helper function to calculate maximum slots across all days
const getMaxSlotsForPractitioner = (
  practitioner: PractionnersWithRelation
): number => {
  return Math.max(
    ...days.map(
      (day) =>
        practitioner.availabilities.filter((av) => av.dayOfWeek === day.key)
          .length
    ),
    1
  );
};

// Helper function to get availabilities for a specific day
const getAvailabilitiesForDay = (
  practitioner: PractionnersWithRelation,
  dayKey: string
) => {
  return practitioner.availabilities.filter((av) => av.dayOfWeek === dayKey);
};

// Helper function to render empty slots
const renderEmptySlots = (count: number, dayKey: string) => {
  return Array.from({ length: count }, (_, index) => (
    <div
      key={`empty-${dayKey}-${index}`}
      className="h-8 flex items-center justify-center text-gray-400 text-sm"
    >
      -
    </div>
  ));
};

export default function PractitionerList({
  practitioners,
}: PractitionerListProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<{
    practitioner: PractionnersWithRelation;
    availability: PractionnersWithRelation["availabilities"][0];
  } | null>(null);

  return (
    <div className="grid gap-6 mt-6">
      {practitioners.map((practitioner) => {
        const maxSlots = getMaxSlotsForPractitioner(practitioner);

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
                    <div className="grid grid-cols-7 gap-2">
                      {days.map((day) => {
                        const availabilities = getAvailabilitiesForDay(
                          practitioner,
                          day.key
                        );

                        return (
                          <div key={day.key} className="flex flex-col gap-1">
                            <p className="font-semibold text-center text-gray-700 mb-1">
                              {day.label}
                            </p>
                            {availabilities.length > 0
                              ? availabilities.map((availability) => (
                                  <Button
                                    key={availability.id}
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-1 cursor-pointer"
                                    onClick={() =>
                                      setSelectedAppointment({
                                        practitioner,
                                        availability,
                                      })
                                    }
                                  >
                                    {availability.startTime}
                                  </Button>
                                ))
                              : renderEmptySlots(maxSlots, day.key)}
                          </div>
                        );
                      })}
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
