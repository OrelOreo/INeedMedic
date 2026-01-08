import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/db/prisma";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    throw new Error("Unauthorized");
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}
