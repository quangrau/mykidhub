import { db } from "@/lib/db";

export async function getSchoolById(id: string) {
  try {
    return await db.school.findUnique({
      where: {
        id,
      },
    });
  } catch {
    return null;
  }
}
