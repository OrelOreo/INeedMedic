import { Calendar, CheckCircle2 } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

export default function AppointmentPreview() {
  return (
    <div>
      <Card className="relative p-6 bg-white/90 backdrop-blur-sm border-2 border-emerald-100 shadow-2xl rounded-3xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-linear-to-r from-emerald-50 to-teal-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-600 rounded-full" />
              <div>
                <div className="font-bold text-gray-900">Dr. Martin Dubois</div>
                <div className="text-sm text-gray-600">Médecin généraliste</div>
              </div>
            </div>
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-5 h-5 text-emerald-500" />
              <span className="font-medium">Mardi 14 Janvier 2026</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["09:00", "10:30", "14:00", "15:30", "16:00", "17:30"].map(
                (time, i) => (
                  <button
                    key={i}
                    className={`p-3 rounded-xl font-medium transition-all ${
                      i === 2
                        ? "bg-linear-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                        : "bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                    }`}
                  >
                    {time}
                  </button>
                )
              )}
            </div>
          </div>

          <Button className="w-full bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg py-6 text-lg">
            Confirmer le rendez-vous
          </Button>
        </div>
      </Card>
    </div>
  );
}
