import { NavItem } from "@/types/nav";
import Link from "next/link";
import { LogoutButton } from "./logout-button";

type DesktopMenuProps = {
  navItems: NavItem[];
  isAuthenticated: boolean;
};
export default function DesktopMenu({
  navItems,
  isAuthenticated,
}: DesktopMenuProps) {
  return (
    <nav className="hidden md:flex items-center gap-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="px-4 py-2 text-sm font-medium rounded-lg
                     hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          {item.label}
        </Link>
      ))}
      {isAuthenticated && <LogoutButton />}
    </nav>
  );
}
