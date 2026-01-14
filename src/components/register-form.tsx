"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "./ui/spinner";
import { useActionState, useState } from "react";
import { registerUser } from "@/lib/server-actions/index";
import {
  User,
  Mail,
  Lock,
  UserCircle,
  AlertCircle,
  Stethoscope,
  Phone,
  MapPin,
} from "lucide-react";
import { RegisterFormState } from "@/types/form-state/register-form-state";
import { Role } from "@prisma/client";
import { SPECIALTIES } from "@/lib/home";
import { CommuneSearchInput } from "./search/commune-search-input";

export default function RegisterForm() {
  const initialState: RegisterFormState = {
    message: null,
    errors: {},
  };

  const [city, setCity] = useState<string>("");

  const [state, formAction, isLoading] = useActionState(
    registerUser,
    initialState
  );
  const [selectRole, setSelectedRole] = useState<Role>("CLIENT");

  return (
    <Card className="w-4/5 md:w-full max-w-sm mt-12">
      <CardHeader>
        <CardTitle>Inscrivez-vous</CardTitle>
        <CardDescription>Entrez les informations demandées.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <div className="grid grid-cols-1 space-y-2 gap-6">
            <div className="space-y-2">
              <div className="flex gap-x-1 items-center">
                <UserCircle className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="role" aria-required="true">
                  Type de compte <span className="text-red-500">*</span>
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  name="role"
                  onValueChange={(value) => setSelectedRole(value as Role)}
                >
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="Sélectionnez un type de compte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLIENT">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Patient</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="PRACTITIONER">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Praticien</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {state.errors?.role &&
                state.errors.role.map((error: string) => (
                  <p
                    id="role-error"
                    aria-live="polite"
                    aria-atomic="true"
                    className="mt-2 text-sm text-red-500"
                    key={error}
                  >
                    {error}
                  </p>
                ))}
            </div>

            <div className="space-y-2">
              <div className="flex gap-x-1 items-center">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="email" aria-required="true">
                  Email<span className="text-red-500">*</span>
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  aria-describedby="email-error"
                />
              </div>
              {state.errors?.email &&
                state.errors.email.map((error: string) => (
                  <p
                    id="email-error"
                    aria-live="polite"
                    aria-atomic="true"
                    className="mt-2 text-sm text-red-500"
                    key={error}
                  >
                    {error}
                  </p>
                ))}
            </div>

            {selectRole === "PRACTITIONER" && (
              <>
                <div className="space-y-2">
                  <div className="flex gap-x-1 items-center">
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="specialty" aria-required="true">
                      Specialité<span className="text-red-500">*</span>
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select aria-describedby="specialty-error" name="specialty">
                      <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 w-full">
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
                  {state.errors?.specialty &&
                    state.errors.specialty.map((error: string) => (
                      <p
                        id="specialty-error"
                        aria-live="polite"
                        aria-atomic="true"
                        className="mt-2 text-sm text-red-500"
                        key={error}
                      >
                        {error}
                      </p>
                    ))}
                </div>
                <div className="space-y-2">
                  <div className="flex gap-x-1 items-center">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="phone" aria-required="true">
                      Téléphone<span className="text-red-500">*</span>
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="0123456789"
                      aria-describedby="phone-error"
                    />
                  </div>
                  {state.errors?.phone &&
                    state.errors.phone.map((error: string) => (
                      <p
                        id="phone-error"
                        aria-live="polite"
                        aria-atomic="true"
                        className="mt-2 text-sm text-red-500"
                        key={error}
                      >
                        {error}
                      </p>
                    ))}
                </div>
                <div className="space-y-2">
                  <div className="flex gap-x-1 items-center">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="address" aria-required="true">
                      Adresse<span className="text-red-500">*</span>
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="123 Rue Exemple"
                      aria-describedby="address-error"
                    />
                  </div>
                  {state.errors?.address &&
                    state.errors.address.map((error: string) => (
                      <p
                        id="address-error"
                        aria-live="polite"
                        aria-atomic="true"
                        className="mt-2 text-sm text-red-500"
                        key={error}
                      >
                        {error}
                      </p>
                    ))}
                </div>
                <div className="space-y-2">
                  <div className="flex gap-x-1 items-center">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="city" aria-required="true">
                      Commune<span className="text-red-500">*</span>
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <CommuneSearchInput
                      value={city}
                      onChange={(communeName: string) => setCity(communeName)}
                    />
                    <input
                      type="hidden"
                      id="city-hidden"
                      name="city"
                      value={city}
                    />
                  </div>
                  {state.errors?.city &&
                    state.errors.city.map((error: string) => (
                      <p
                        id="city-error"
                        aria-live="polite"
                        aria-atomic="true"
                        className="mt-2 text-sm text-red-500"
                        key={error}
                      >
                        {error}
                      </p>
                    ))}
                </div>
              </>
            )}

            <div className="space-y-2">
              <div className="flex gap-x-1 items-center">
                <User className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="name" aria-required="true">
                  Nom complet<span className="text-red-500">*</span>
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Jean Dupont"
                  aria-describedby="name-error"
                />
              </div>
              {state.errors?.name &&
                state.errors.name.map((error: string) => (
                  <p
                    id="name-error"
                    aria-live="polite"
                    aria-atomic="true"
                    className="mt-2 text-sm text-red-500"
                    key={error}
                  >
                    {error}
                  </p>
                ))}
            </div>

            <div className="space-y-2">
              <div className="flex gap-x-1 items-center">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="password" aria-required="true">
                  Mot de passe<span className="text-red-500">*</span>
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  aria-describedby="password-error"
                />
              </div>
              {state.errors?.password &&
                state.errors.password.map((error: string) => (
                  <p
                    id="password-error"
                    aria-live="polite"
                    aria-atomic="true"
                    className="mt-2 text-sm text-red-500"
                    key={error}
                  >
                    {error}
                  </p>
                ))}
            </div>

            <div className="space-y-2">
              <div className="flex gap-x-1 items-center">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="confirmPassword" aria-required="true">
                  Confirmer le mot de passe
                  <span className="text-red-500">*</span>
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  aria-describedby="confirmPassword-error"
                />
              </div>
              {state.errors?.confirmPassword &&
                state.errors.confirmPassword.map((error: string) => (
                  <p
                    id="confirmPassword-error"
                    aria-live="polite"
                    aria-atomic="true"
                    className="mt-2 text-sm text-red-500"
                    key={error}
                  >
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {state.errors?.globalErrors && state.message && (
            <Alert variant="destructive" className="my-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{state.message}</AlertTitle>
            </Alert>
          )}

          {Object.keys(state.errors || {}).length === 0 && state.message && (
            <Alert variant="default" className="my-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{state.message}</AlertTitle>
            </Alert>
          )}

          <Separator className="my-6" />

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isLoading}
              aria-disabled={isLoading}
              aria-busy={isLoading}
            >
              S'inscrire
              {isLoading && <Spinner className="ml-2" />}
            </Button>
            <Button
              asChild
              variant="link"
              disabled={isLoading}
              aria-disabled={isLoading}
              aria-busy={isLoading}
            >
              <Link href="/login">Déjà un compte ?</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
