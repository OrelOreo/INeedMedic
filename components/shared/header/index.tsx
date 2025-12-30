import Link from "next/link";
import { NavItem } from "@/types/nav";

import MobileMenu from "./mobile-menu";

import DesktopMenu from "./desktop-menu";
import { Separator } from "@/components/ui/separator";

interface HeaderProps {
  isAuthenticated?: boolean;
  userRole?: "CLIENT" | "PRACTITIONER";
  userName?: string;
  userEmail?: string;
  userImage?: string;
}

const unauthenticatedNavItems: NavItem[] = [
  { label: "Se connecter", href: "/login" },
  { label: "S'inscrire", href: "/register" },
];

const clientNavItems: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Mes rendez-vous", href: "/dashboard/appointments" },
];

const practitionerNavItems: NavItem[] = [
  { label: "Agenda", href: "/dashboard/calendar" },
  { label: "Rendez-vous", href: "/dashboard/appointments" },
  { label: "Disponibilités", href: "/dashboard/availability" },
];

export function Header({
  isAuthenticated = false,
  userRole = "CLIENT",
  userName = "Utilisateur",
  userEmail = "user@example.com",
  userImage,
}: HeaderProps) {
  const navItems = isAuthenticated
    ? userRole === "PRACTITIONER"
      ? practitionerNavItems
      : clientNavItems
    : unauthenticatedNavItems;

  // const userInitials = userName
  //   .split(" ")
  //   .map((n) => n[0])
  //   .join("")
  //   .toUpperCase()
  //   .slice(0, 2);

  return (
    <header className="w-full">
      <div className="container mx-auto h-16 flex items-center">
        <Link href="/" className="text-lg font-semibold">
          INeedMedic
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <MobileMenu navItems={navItems} />
          <DesktopMenu navItems={navItems} />
        </div>
      </div>
      <Separator />
    </header>
  );
}
