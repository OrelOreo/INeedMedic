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
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SPECIALTIES } from "@/lib/home";

interface Commune {
  nom: string;
  code: string;
  codeDepartement: string;
  siren: string;
  codeEpci: string;
  codeRegion: string;
  codesPostaux: string[];
  population: number;
  _score: string;
}

export default function SearchForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    location: "",
    specialty: "",
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debounce effect
  useEffect(() => {
    if (!formData.location || formData.location.length < 2) {
      setCommunes([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(
            formData.location
          )}&limit=10`
        );
        const data: Commune[] = await response.json();
        setCommunes([...communes, ...data]);
      } catch (error) {
        console.error("Erreur lors de la recherche de communes:", error);
        setCommunes([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [formData.location]);

  const handleCitySelect = (commune: Commune) => {
    setFormData({ ...formData, location: commune.nom });
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
          {showSuggestions && (communes.length > 0 || isLoading) && (
            <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="px-4 py-2 text-gray-500">Recherche...</div>
              ) : (
                communes.map((commune) => (
                  <div
                    key={`commune-${commune.code} - ${commune.nom}`}
                    onClick={() => handleCitySelect(commune)}
                    className="px-4 py-2 hover:bg-emerald-50 cursor-pointer transition-colors"
                  >
                    <div className="font-medium">{commune.nom}</div>
                    <div className="text-xs text-gray-500">
                      {commune.codesPostaux[0]} - Dép. {commune.codeDepartement}
                    </div>
                  </div>
                ))
              )}
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
