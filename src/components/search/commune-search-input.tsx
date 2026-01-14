"use client";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { MapPin } from "lucide-react";

type Commune = {
  nom: string;
  code: string;
  codeDepartement: string;
  siren: string;
  codeEpci: string;
  codeRegion: string;
  codesPostaux: string[];
  population: number;
  _score: string;
};

export function CommuneSearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (communeName: string) => void;
}) {
  const [inputValue, setInputValue] = useState(value);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (!inputValue || inputValue.length < 2) {
      setCommunes([]);
      return;
    }
    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(
            inputValue
          )}&limit=10`
        );
        const data: Commune[] = await response.json();
        setCommunes(data);
      } catch {
        setCommunes([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  return (
    <div className="relative w-full">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <Input
        type="text"
        placeholder="Votre ville (ex: Paris, Lyon...)"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
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
                key={commune.code}
                onClick={() => {
                  onChange(commune.nom);
                  setShowSuggestions(false);
                }}
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
  );
}
