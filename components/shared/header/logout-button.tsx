"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <Button
      variant="destructive"
      className="flex items-center gap-2 text-sm cursor-pointer"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Déconnexion
      <LogOut className="h-4 w-4" />
    </Button>
  );
}
