"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  return (
    <Card className="w-4/5 md:w-full max-w-sm mt-12">
      <CardHeader>
        <CardTitle>Connectez-vous</CardTitle>
        <CardDescription>Entrez les informations demandées.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
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
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full cursor-pointer">
          Se connecter
        </Button>
        <Button asChild variant="link">
          <Link href="/register">S'inscrire</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
