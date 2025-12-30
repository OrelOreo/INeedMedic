import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Fonction helper pour récupérer la session côté serveur
export async function getSession() {
  return await getServerSession(authOptions);
}

// Fonction helper pour vérifier si l'utilisateur est authentifié
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

// Fonction helper pour vérifier le rôle
export async function requireRole(
  allowedRoles: Array<"CLIENT" | "PRACTITIONER">
) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Non authentifié");
  }

  if (!allowedRoles.includes(user.role)) {
    throw new Error("Non autorisé");
  }

  return user;
}
