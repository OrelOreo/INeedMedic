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
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import z, { email } from "zod";
import {
  EMAIL_INVALID_MESSAGE,
  EMAIL_OR_PASSWORD_INVALID_MESSAGE,
  REQUIRE_PASSWORD_MESSAGE,
} from "@/lib/helpers/messages-helpers";

interface LoginFormData {
  email: string;
  password: string;
}

const loginSchema = z.object({
  email: z.email(EMAIL_INVALID_MESSAGE),
  password: z.string().min(6, REQUIRE_PASSWORD_MESSAGE),
});

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    setIsLoading(true);
    const validatedFields = loginSchema.safeParse({
      email: formData.email,
      password: formData.password,
    });
    if (!validatedFields.success) {
      const errorTree = z.treeifyError(validatedFields.error);
      setValidationErrors({
        email: errorTree.properties?.email?.errors
          ? errorTree.properties.email.errors[0]
          : undefined,
        password: errorTree.properties?.password?.errors
          ? errorTree.properties.password.errors[0]
          : undefined,
      });
      setIsLoading(false);
      return;
    }
    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setGlobalError(EMAIL_OR_PASSWORD_INVALID_MESSAGE);
      } else if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setGlobalError("Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-4/5 md:w-full max-w-sm mt-12">
      <CardHeader>
        <CardTitle>Connectez-vous</CardTitle>
        <CardDescription>Entrez les informations demandées.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">
                Email<span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                aria-describedby="email-error"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              {validationErrors.email && (
                <p
                  id="email-error"
                  aria-live="polite"
                  aria-atomic="true"
                  className="text-sm text-red-500"
                  key={validationErrors.email}
                >
                  {validationErrors.email}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">
                  Mot de passe<span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                value={formData.password}
                aria-describedby="password-error"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              {validationErrors.password && (
                <p
                  id="password-error"
                  aria-live="polite"
                  aria-atomic="true"
                  className="text-sm text-red-500"
                  key={validationErrors.password}
                >
                  {validationErrors.password}
                </p>
              )}
            </div>
          </div>
          {globalError && (
            <p
              aria-live="polite"
              aria-atomic="true"
              className="text-sm mt-4 text-center text-red-500"
            >
              {globalError}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex-col mt-6 gap-2">
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isLoading}
          >
            Se connecter
          </Button>
          <Button asChild variant="link" disabled={isLoading}>
            <Link href="/register">S'inscrire</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
