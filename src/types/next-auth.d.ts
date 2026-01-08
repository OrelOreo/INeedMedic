import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

// Étendre les types NextAuth pour inclure nos champs personnalisés
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "CLIENT" | "PRACTITIONER";
      practitionerId?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: "CLIENT" | "PRACTITIONER";
    practitionerId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: "CLIENT" | "PRACTITIONER";
    practitionerId?: string;
  }
}
