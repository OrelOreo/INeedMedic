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
import { useActionState } from "react";
import { registerUser } from "@/lib/server-actions/index";
import { User, Mail, Lock, UserCircle, AlertCircle } from "lucide-react";
import { RegisterFormState } from "@/types/form-state/register-form-state";

export default function RegisterForm() {
  const initialState: RegisterFormState = {
    message: null,
    errors: {},
  };

  const [state, formAction] = useActionState(registerUser, initialState);

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
                <Label htmlFor="role">
                  Type de compte <span className="text-red-500">*</span>
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Select name="role">
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
                <User className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="name">
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
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="email">
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

            <div className="space-y-2">
              <div className="flex gap-x-1 items-center">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="password">
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
                <Label htmlFor="confirmPassword">
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
            <Button type="submit" className="w-full cursor-pointer">
              S'inscrire
            </Button>
            <Button asChild variant="link">
              <Link href="/login">Déjà un compte ?</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
