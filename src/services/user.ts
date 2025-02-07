import { prisma } from "@/lib/prisma";
import { User, UserRole } from "@prisma/client";
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

export type UserWithoutPassword = Omit<User, "password">;

export interface UserWithSchool extends UserWithoutPassword {
  school?: {
    id: string;
    name: string;
    slug: string;
    role: string;
  };
}

class UserServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserServiceError";
  }
}

const omitPassword = (user: User): UserWithoutPassword => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
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

      // Get the user's school information
      // console.log({ user });

      const userWithoutPassword = omitPassword(user);

      return {
        ...userWithoutPassword,
      } as UserWithSchool;
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      console.error("Error validating credentials:", error);
      throw new UserServiceError("Failed to validate credentials");
    }
  },
};

export default userService;
