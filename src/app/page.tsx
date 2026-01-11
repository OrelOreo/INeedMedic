"use client";

import { useState } from "react";
import {
  Calendar,
  Users,
  CheckCircle2,
  ArrowRight,
  Shield,
  MapPin,
  Search,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HomePage() {
  const [city, setCity] = useState("");
  const [specialty, setSpecialty] = useState("");

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-block px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 font-semibold text-sm">
              ✨ Simplifiez votre santé
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Prenez rendez-vous avec votre{" "}
              <span className="bg-linear-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                médecin
              </span>{" "}
              en quelques clics
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Trouvez le bon praticien, consultez les disponibilités en temps
              réel et réservez votre consultation en toute simplicité. Votre
              santé mérite le meilleur service.
            </p>
            <Button
              size="lg"
              className="bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-xl shadow-emerald-200 group"
            >
              Trouver un médecin
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            {/* Search Bar */}
            <Card className="p-6 bg-white border-2 border-emerald-100 shadow-xl mt-8">
              <div className="space-y-4 flex flex-col gap-y-2">
                {/* <div> */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Votre ville (ex: Paris, Lyon...)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="pl-10 h-12 border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
                  <Select value={specialty} onValueChange={setSpecialty}>
                    <SelectTrigger className="pl-10 h-12 border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500">
                      <SelectValue placeholder="Type de médecin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="generaliste">
                        Médecin généraliste
                      </SelectItem>
                      <SelectItem value="cardiologue">Cardiologue</SelectItem>
                      <SelectItem value="dermatologue">Dermatologue</SelectItem>
                      <SelectItem value="gynecologue">Gynécologue</SelectItem>
                      <SelectItem value="ophtalmologue">
                        Ophtalmologue
                      </SelectItem>
                      <SelectItem value="orl">ORL</SelectItem>
                      <SelectItem value="pediatre">Pédiatre</SelectItem>
                      <SelectItem value="psychiatre">Psychiatre</SelectItem>
                      <SelectItem value="psychologue">Psychologue</SelectItem>
                      <SelectItem value="radiologue">Radiologue</SelectItem>
                      <SelectItem value="dentiste">Dentiste</SelectItem>
                      <SelectItem value="kinesitherapeute">
                        Kinésithérapeute
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* </div> */}
                <Button className="w-full cursor-pointer h-12 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg text-base font-semibold group">
                  <Search className="w-5 h-5 mr-2" />
                  Rechercher un médecin
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </div>

          <div className="relative animate-slide-in">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-200 to-teal-200 rounded-3xl blur-3xl opacity-30 animate-pulse" />
            <Card className="relative p-8 bg-white/90 backdrop-blur-sm border-2 border-emerald-100 shadow-2xl rounded-3xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-linear-to-r from-emerald-50 to-teal-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-600 rounded-full" />
                    <div>
                      <div className="font-bold text-gray-900">
                        Dr. Martin Dubois
                      </div>
                      <div className="text-sm text-gray-600">
                        Médecin généraliste
                      </div>
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
        </div>
      </section>

      {/* Features Section */}
      <section id="fonctionnalites" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Pourquoi choisir{" "}
              <span className="bg-linear-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                INeedMedic
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une plateforme conçue pour faciliter l'accès aux soins de santé
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "Réservation instantanée",
                description:
                  "Consultez les disponibilités en temps réel et réservez votre rendez-vous 24h/24, 7j/7",
                color: "from-emerald-500 to-teal-600",
              },
              {
                icon: Users,
                title: "Réseau de médecins",
                description:
                  "Accédez à un large réseau de professionnels de santé qualifiés et vérifiés",
                color: "from-teal-500 to-cyan-600",
              },
              {
                icon: Shield,
                title: "Données sécurisées",
                description:
                  "Vos informations médicales sont protégées selon les normes les plus strictes",
                color: "from-cyan-500 to-blue-600",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-8 border-2 transition-all duration-300  border-gray-100 hover:border-emerald-200"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl bg-linear-to-br ${feature.color} flex items-center justify-center mb-6 transition-transform`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="comment-ca-marche"
        className="py-20 bg-linear-to-br from-emerald-50 to-teal-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600">
              Trois étapes simples pour votre rendez-vous
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Recherchez",
                description:
                  "Trouvez le médecin qui correspond à vos besoins parmi notre réseau",
              },
              {
                step: "02",
                title: "Réservez",
                description:
                  "Choisissez votre créneau horaire parmi les disponibilités en temps réel",
              },
              {
                step: "03",
                title: "Consultez",
                description:
                  "Recevez une confirmation et rendez-vous à votre consultation",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-linear-to-r from-emerald-300 to-teal-300 -translate-x-1/2" />
                )}
                <div className="relative bg-white rounded-2xl p-8 shadow-lg border-2 border-emerald-100">
                  <div className="text-6xl font-bold bg-linear-to-br from-emerald-500 to-teal-600 bg-clip-text text-transparent mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-emerald-500 to-teal-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à prendre soin de votre santé ?
          </h2>
          <p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de patients qui font confiance à INeedMedic
            pour leurs rendez-vous médicaux
          </p>
          <Button
            size="lg"
            className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-2xl px-8 py-6 text-lg font-semibold"
          >
            Commencer maintenant
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
