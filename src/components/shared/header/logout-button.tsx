"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LogOutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogOutButtonProps) {
  return (
    <Button
      variant="destructive"
      className={cn(
        "flex items-center gap-2 text-sm cursor-pointer",
        className
      )}
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Déconnexion
      <LogOut className="h-4 w-4" />
    </Button>
  );
}
