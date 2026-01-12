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
import SearchForm from "@/components/shared/search-form";
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
    searchParams?.city || "",
    searchParams?.specialty || ""
  );

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
      <SearchForm />

      <div className="grid gap-6 mt-6">
        {practitioners.map((practitioner) => (
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
                {/* Left Column */}
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

                {/* Right Column */}
                <div className="flex flex-col justify-between">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-3">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Disponibilités</span>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {days.map((day) => {
                        const availabilities =
                          practitioner.availabilities.filter(
                            (av) => av.dayOfWeek === day.key
                          );

                        // Trouver le nombre maximum de créneaux parmi tous les jours
                        const maxSlots = Math.max(
                          ...days.map(
                            (d) =>
                              practitioner.availabilities.filter(
                                (av) => av.dayOfWeek === d.key
                              ).length
                          ),
                          1 // Au minimum 1 pour éviter les divisions par zéro
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
                                  >
                                    {availability.startTime}
                                  </Button>
                                ))
                              : // Créer autant de "-" que le max de créneaux
                                Array.from({ length: maxSlots }).map(
                                  (_, index) => (
                                    <div
                                      key={`empty-${day.key}-${index}`}
                                      className="h-8 flex items-center justify-center text-gray-400 text-sm"
                                    >
                                      -
                                    </div>
                                  )
                                )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
