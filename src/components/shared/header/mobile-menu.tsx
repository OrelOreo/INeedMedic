"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { NavItem } from "@/types/nav";
import { LogoutButton } from "./logout-button";

type MobileMenuProps = {
  navItems: readonly NavItem[];
  isAuthenticated: boolean;
};

export default function MobileMenu({
  navItems,
  isAuthenticated,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="md:hidden flex items-center">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-75">
          <SheetHeader>
            <SheetTitle>
              <Link href="/" onClick={() => setIsOpen(false)}>
                INeedMedic
              </Link>
            </SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          <nav className="mt-8 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg
                           hover:bg-gray-100 hover:text-gray-900"
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated && <LogoutButton className="mx-4" />}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
