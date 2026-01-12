"use client";
import { Card } from "../ui/card";
import { ArrowRight, MapPin, Search, Stethoscope } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SPECIALTIES } from "@/lib/home";

const COMMUNES = [
  "Paris",
  "Lyon",
  "Marseille",
  "Toulouse",
  "Nice",
  "Nantes",
  "Montpellier",
  "Strasbourg",
  "Bordeaux",
  "Lille",
  "Rennes",
  "Reims",
  "Saint-Étienne",
  "Toulon",
  "Le Havre",
  "Grenoble",
  "Dijon",
  "Angers",
  "Nîmes",
  "Villeurbanne",
];

export default function SearchForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    location: "",
    specialty: "",
  });
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredCommunes = formData.location
    ? COMMUNES.filter((commune) =>
        commune.toLowerCase().includes(formData.location.toLowerCase())
      )
    : [];

  const handleCitySelect = (commune: string) => {
    setFormData({ ...formData, location: commune });
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (formData.location) params.set("location", formData.location);
    if (formData.specialty) params.set("specialty", formData.specialty);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <Card className="p-4 sm:p-6 bg-white border-2 border-emerald-100 shadow-xl mt-8 w-full">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 flex flex-col gap-y-2 w-full"
      >
        <div className="relative w-full">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Votre ville (ex: Paris, Lyon...)"
            value={formData.location}
            onChange={(e) => {
              setFormData({ ...formData, location: e.target.value });
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-10 h-12 border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 w-full"
          />
          {showSuggestions && filteredCommunes.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredCommunes.map((commune) => (
                <div
                  key={commune}
                  onClick={() => handleCitySelect(commune)}
                  className="px-4 py-2 hover:bg-emerald-50 cursor-pointer transition-colors"
                >
                  {commune}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="relative w-full">
          <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
          <Select
            value={formData.specialty}
            onValueChange={(value) =>
              setFormData({ ...formData, specialty: value })
            }
          >
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
        <Button
          type="submit"
          className="w-full cursor-pointer h-12 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg text-base font-semibold group"
        >
          <Search className="w-5 h-5 mr-2" />
          Rechercher un médecin
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>
    </Card>
  );
}
