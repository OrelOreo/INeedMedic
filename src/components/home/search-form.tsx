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
import { SPECIALTIES } from "@/lib/home";

export default function SearchForm() {
  const [city, setCity] = useState("");
  const [specialty, setSpecialty] = useState("");
  return (
    <Card className="p-4 sm:p-6 bg-white border-2 border-emerald-100 shadow-xl mt-8 w-full">
      <form className="space-y-4 flex flex-col gap-y-2 w-full">
        <div className="relative w-full">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Votre ville (ex: Paris, Lyon...)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="pl-10 h-12 border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 w-full"
          />
        </div>
        <div className="relative w-full">
          <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
          <Select value={specialty} onValueChange={setSpecialty}>
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
        <Button className="w-full cursor-pointer h-12 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg text-base font-semibold group">
          <Search className="w-5 h-5 mr-2" />
          Rechercher un médecin
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>
    </Card>
  );
}
