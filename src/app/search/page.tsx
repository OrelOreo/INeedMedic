import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Award,
  Calendar,
  Clock,
  Mail,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import { days } from "@/lib/utils";

import { searchPractionnersByLocationAndSpeciality } from "@/lib/server-actions/index";

export default async function SearchPage(props: {
  searchParams?: Promise<{
    city?: string;
    specialty?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  console.log("🚀 ~ SearchPage ~ searchParams:", searchParams);
  const practitioners = await searchPractionnersByLocationAndSpeciality(
    "paris",
    "Kinésithérapeute"
    // searchParams?.location,
    // searchParams?.speciality
  );
  console.log("🚀 ~ SearchPage ~ practitioners:", practitioners);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const generateTimeSlots = (startTime: string, endTime: string) => {
    const slots: string[] = [];
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    let currentHour = startHour;
    let currentMinute = startMinute;

    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMinute < endMinute)
    ) {
      slots.push(
        `${String(currentHour).padStart(2, "0")}:${String(
          currentMinute
        ).padStart(2, "0")}`
      );

      currentMinute += 30;
      if (currentMinute >= 60) {
        currentMinute = 0;
        currentHour += 1;
      }
    }

    return slots;
  };

  return (
    <main className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Trouvez votre praticien
        </h1>
        <p className="text-lg text-gray-600">
          {practitioners.length} praticien{practitioners.length > 1 ? "s" : ""}{" "}
          disponible{practitioners.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid gap-6">
        {practitioners.map((practitioner) => (
          <Card key={practitioner.id} className="border border-emerald-100 ">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <Avatar className="w-16 h-16 border-2 border-emerald-200">
                    <AvatarImage src={practitioner.user.image || undefined} />
                    <AvatarFallback className="bg-linear-to-br from-emerald-500 to-teal-600 text-white text-lg font-semibold">
                      {getInitials(practitioner.user.name)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1">
                    <CardTitle className="text-2xl text-gray-900 mb-1">
                      {practitioner.user.name}
                    </CardTitle>
                    <CardDescription className="text-base">
                      <span className="text-emerald-700 font-semibold">
                        {practitioner.specialty}
                      </span>
                    </CardDescription>

                    {/* Location */}
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
                {/* Left Column */}
                <div className="space-y-3">
                  {/* Contact Info */}
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm">{practitioner.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm">{practitioner.user.email}</span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col justify-between">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-3">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Disponibilités</span>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {days.map((day) => {
                        const availability = practitioner.availabilities.find(
                          (av) => av.dayOfWeek === day.key
                        );

                        return (
                          <div key={day.key} className="flex flex-col gap-1">
                            <p className="font-semibold text-center text-gray-700 mb-1">
                              {day.label}
                            </p>
                            {availability ? (
                              generateTimeSlots(
                                availability.startTime,
                                availability.endTime
                              ).map((time) => (
                                <Button
                                  key={`${day.key}-${time}`}
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-1 cursor-pointer"
                                >
                                  {time}
                                </Button>
                              ))
                            ) : (
                              <div className="text-center text-gray-400 py-2">
                                -
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-gray-50 border-t border-gray-100 flex gap-3">
              <Button className="flex-1 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white">
                <Calendar className="w-4 h-4 mr-2" />
                Prendre rendez-vous
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
