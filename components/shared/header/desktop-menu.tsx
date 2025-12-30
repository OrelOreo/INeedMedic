import { NavItem } from "@/types/nav";
import Link from "next/link";

type DesktopMenuProps = {
  navItems: NavItem[];
};
export default function DesktopMenu({ navItems }: DesktopMenuProps) {
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
    </nav>
  );
}
