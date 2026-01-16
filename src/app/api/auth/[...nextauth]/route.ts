import NextAuth, { NextAuthOptions } from "next-auth";
import { RateLimiterMemory } from "rate-limiter-flexible";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import bcrypt from "bcryptjs";
import { getUserIp } from "@/app/api/user-ip";

const rateLimiter = new RateLimiterMemory({
  points: 5, // 5 requests
  duration: 60, // per 60 seconds per IP
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email et mot de passe requis.");
        }

        const userIP = await getUserIp();

        try {
          await rateLimiter.consume(userIP, 2);
        } catch (error) {
          throw new Error(
            "Trop de tentatives de connexion. Veuillez réessayer plus tard."
          );
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            practitioner: true,
          },
        });
        if (!user || !user.password) {
          throw new Error("Email ou mot de passe incorrect");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Email ou mot de passe incorrect");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
          practitionerId: user.practitioner?.id,
        };
      },
    }),
  ],

  callbacks: {
    // Callback JWT : ajouter des infos custom au token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.practitionerId = user.practitionerId;
      }
      return token;
    },

    // Callback Session : ajouter des infos custom à la session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "CLIENT" | "PRACTITIONER";
        session.user.practitionerId = token.practitionerId as
          | string
          | undefined;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
