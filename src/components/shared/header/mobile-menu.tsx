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
import { Heart, Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { NavItem } from "@/types/nav";
import { LogoutButton } from "./logout-button";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type MobileMenuProps = {
  navItems: readonly NavItem[];
  isAuthenticated: boolean;
};

export default function MobileMenu({
  navItems,
  isAuthenticated,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (isDesktop) {
      setIsOpen(false);
    }
  }, [isDesktop]);

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
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center ml-4 md:ml-0">
                  <Heart className="w-6 h-6 text-white" fill="white" />
                </div>
                <span className="text-2xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  INeedMedic
                </span>
              </Link>
            </SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          <nav className="mt-8 flex flex-col gap-2" role="navigation">
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
