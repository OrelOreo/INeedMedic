import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Stethoscope } from "lucide-react";
import { SPECIALTIES } from "@/lib/home";

export function SpecialtySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (specialty: string) => void;
}) {
  return (
    <div className="relative w-full">
      <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="pl-10 h-12 border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 w-full">
          <SelectValue placeholder="Type de médecin" />
        </SelectTrigger>
        <SelectContent className="w-full">
          {SPECIALTIES.map((spec) => (
            <SelectItem key={spec.value} value={spec.value}>
              {spec.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
