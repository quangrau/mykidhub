import { db } from "@/lib/db";
import { Account, School } from "@prisma/client";
import { compare } from "bcryptjs";

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
}

export type UserWithoutPassword = Pick<
  Account,
  "id" | "name" | "email" | "image" | "role"
>;

export interface UserWithSchool extends UserWithoutPassword {
  school?: Pick<School, "id" | "name">;
}

class UserServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserServiceError";
  }
}

const userDTO = (user: Account): UserWithoutPassword => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
  };
};

export const userService = {
  async validateUserCredentials(
    email: string,
    password: string
  ): Promise<UserWithSchool> {
    try {
      const user = await db.account.findUnique({
        where: { email },
        include: {
          school: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!user || !user.password) {
        throw new UserServiceError("Invalid credentials");
      }

      const isValid = await compare(password, user.password);
      if (!isValid) {
        throw new UserServiceError("Invalid credentials");
      }

      const userCredentials = userDTO(user);
      return {
        ...userCredentials,
        school: user.school
          ? {
              id: user.school.id,
              name: user.school.name,
            }
          : undefined,
      };
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      console.error("Error validating credentials:", error);
      throw new UserServiceError("Failed to validate credentials");
    }
  },
};

export default userService;
