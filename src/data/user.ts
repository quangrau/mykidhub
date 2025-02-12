import { db } from "@/lib/database/prisma";

export async function getUserByEmail(email: string) {
  try {
    return await db.user.findUnique({
      where: {
        email,
      },
    });
  } catch {
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    return await db.user.findUnique({
      where: {
        id,
      },
      include: {
        school: {
          select: {
            name: true,
          },
        },
      },
    });
  } catch {
    return null;
  }
}
