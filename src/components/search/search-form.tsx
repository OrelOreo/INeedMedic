"use client";
import { Card } from "../ui/card";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CommuneSearchInput } from "./commune-search-input";
import { SpecialtySelect } from "./specialty-select";

export default function SearchForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ location: "", specialty: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(false);
    const params = new URLSearchParams();
    if (formData.location) params.set("location", formData.location);
    if (formData.specialty) params.set("specialty", formData.specialty);
    setIsLoading(true);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <Card className="p-4 sm:p-6 bg-white border-2 border-emerald-100 shadow-xl mt-8 w-full">
      <form
        role="search"
        onSubmit={handleSubmit}
        className="space-y-4 flex flex-col gap-y-2 w-full"
      >
        <CommuneSearchInput
          value={formData.location}
          onChange={(location) => setFormData({ ...formData, location })}
        />
        <SpecialtySelect
          value={formData.specialty}
          onChange={(specialty) => setFormData({ ...formData, specialty })}
        />
        <Button
          type="submit"
          disabled={isLoading}
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
