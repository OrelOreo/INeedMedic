import Link from "next/link";
import { getServerSession } from "next-auth";

import MobileMenu from "./mobile-menu";
import DesktopMenu from "./desktop-menu";
import { Separator } from "@/components/ui/separator";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getNavigationItems, getHomeHref } from "@/lib/navigation";

export async function Header() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session;
  const userRole = session?.user?.role;

  const navItems = getNavigationItems(isAuthenticated, userRole);
  const homeHref = getHomeHref(isAuthenticated);

  return (
    <header className="w-full">
      <div className="container mx-auto h-16 flex items-center">
        <Link href={homeHref} className="text-lg font-semibold ml-2 md:ml-0">
          INeedMedic
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
