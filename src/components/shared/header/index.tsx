import Link from "next/link";
import { getServerSession } from "next-auth";

import MobileMenu from "./mobile-menu";
import DesktopMenu from "./desktop-menu";
import { Separator } from "@/components/ui/separator";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getNavigationItems, getHomeHref } from "@/lib/navigation";
import { Heart } from "lucide-react";

export async function Header() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session;
  const userRole = session?.user?.role;

  const navItems = getNavigationItems(isAuthenticated, userRole);
  const homeHref = getHomeHref(isAuthenticated);

  return (
    <header className="w-full">
      <div className="container mx-auto h-16 flex items-center">
        <Link href={homeHref} className="flex items-center gap-2">
          <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center ml-4 md:ml-0">
            <Heart className="w-6 h-6 text-white" fill="white" />
          </div>
          <span className="text-2xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            INeedMedic
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <MobileMenu navItems={navItems} isAuthenticated={isAuthenticated} />
          <DesktopMenu navItems={navItems} isAuthenticated={isAuthenticated} />
        </div>
      </div>
      <Separator />
    </header>
  );
}
