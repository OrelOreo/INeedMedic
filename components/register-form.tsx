import Link from "next/link";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "CLIENT" | "PRACTITIONER";
}

export default function RegisterForm() {
  return (
    <Card className="w-4/5 md:w-full max-w-sm mt-12">
      <CardHeader>
        <CardTitle>Inscrivez-vous</CardTitle>
        <CardDescription>Entrez les informations demandées.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <Label htmlFor="role">
                Type de compte <span className="text-red-500">*</span>
              </Label>
              <Select>
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
            <div className="grid gap-2">
              <Label htmlFor="name">
                Nom complet<span className="text-red-500">*</span>
              </Label>
              <Input id="name" type="text" placeholder="Jean Dupont" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">
                Email<span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">
                  Mot de passe<span className="text-red-500">*</span>
                </Label>
              </div>
              <Input id="password" type="password" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="confirmPassword">
                  Confirmer le mot de passe
                  <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input id="confirmPassword" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full cursor-pointer">
          S'inscrire
        </Button>
        <Button asChild variant="link">
          <Link href="/login">Déjà un compte ?</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
