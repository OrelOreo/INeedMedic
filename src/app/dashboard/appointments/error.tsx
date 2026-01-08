"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    if (error.message === "Unauthorized") {
      router.push("/login");
    }
  }, [error, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 ">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-red-100 p-3">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Une erreur est survenue
            </h2>
            <p className="text-sm text-muted-foreground">
              Nous sommes désolés pour ce désagrément
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <Alert variant="destructive" className="border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Détails de l'erreur</AlertTitle>
            <AlertDescription className="mt-2">
              {error.message || "Une erreur inattendue s'est produite"}
            </AlertDescription>
          </Alert>
        </CardContent>

        <CardFooter className="flex gap-3 justify-center">
          <Button
            onClick={reset}
            className="gap-2 cursor-pointer"
            variant="default"
          >
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/dashboard">Retour à l'accueil</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
