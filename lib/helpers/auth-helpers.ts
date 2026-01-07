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
// Fonction helper pour savoir le rôle de l'utilisateur courant
export async function getCurrentRole() {
  const session = await getSession();
  return session?.user.role;
}
