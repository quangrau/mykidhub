import { prisma } from "@/lib/prisma";
import { School, User, UserRole } from "@prisma/client";
import { compare } from "bcryptjs";

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export type UserWithoutPassword = Pick<User, "id" | "name" | "email" | "image">;

export interface UserWithSchool extends UserWithoutPassword {
  school?: Pick<School, "id" | "name">;
}

class UserServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserServiceError";
  }
}

const userDTO = (user: User): UserWithoutPassword => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
  };
};

export const userService = {
  async validateUserCredentials(
    email: string,
    password: string
  ): Promise<UserWithSchool> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          school: {
            select: {
              id: true,
              name: true,
              slug: true,
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
