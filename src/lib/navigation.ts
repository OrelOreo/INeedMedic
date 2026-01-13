import { NavItem } from "@/types/nav";

export const NAV_ITEMS = {
  unauthenticated: [
    { label: "Se connecter", href: "/login" },
    { label: "S'inscrire", href: "/register" },
  ] as const satisfies readonly NavItem[],

  client: [
    { label: "Profil", href: "/profile" },
    { label: "Mes rendez-vous", href: "/dashboard/appointments" },
  ] as const satisfies readonly NavItem[],

  practitioner: [
    { label: "Profil", href: "/profile" },
    { label: "Rendez-vous", href: "/dashboard/appointments" },
    { label: "Disponibilités", href: "/dashboard/availability" },
  ] as const satisfies readonly NavItem[],
} as const;

type UserRole = "CLIENT" | "PRACTITIONER";

export function getNavigationItems(
  isAuthenticated: boolean,
  userRole?: UserRole
): readonly NavItem[] {
  if (!isAuthenticated) {
    return NAV_ITEMS.unauthenticated;
  }

  if (userRole === "PRACTITIONER") {
    return NAV_ITEMS.practitioner;
  }

  return NAV_ITEMS.client;
}

export function getHomeRefByRole(userRole?: UserRole): string {
  return userRole === "PRACTITIONER" ? "/dashboard/appointments" : "/";
}
