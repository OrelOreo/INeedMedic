import { prisma } from "@/db/prisma";
import { User } from "@prisma/client";

async function findUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    })
    return user
}

async function findPasswordHashById(userId: string): Promise<{password: string} | null>{
    const password = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: { password: true }
    })
    return password ?? null
}

async function updatePasswordHash({ id, passwordHash }: { id: string, passwordHash: string }): Promise<User> {
    const updatedUser = await prisma.user.update({
         where: { id: id },
         data: { password: passwordHash },
    })
    return updatedUser
}

async function createUser(
    { name, email, passwordHash, role }: { name: string, email: string, passwordHash: string, role: "PRACTITIONER" | "CLIENT" },
    practitioner?: { specialty: string, phone?: string, address?: string, city?: string }
): Promise<User> {
    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: passwordHash,
            role,
            ...(practitioner && {
                practitioner: {
                    create: practitioner,
                },
            }),
        },
    })
    return createdUser
}

async function updateUser({ id, name, email }: { id: string, name: string, email: string }): Promise<User> {
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        name: name,
        email: email,
      },
    })
    return updatedUser
}

export { findUserByEmail, findPasswordHashById, updatePasswordHash, createUser, updateUser }