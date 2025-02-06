import { prisma } from "@/lib/prisma";
import { User, UserRole } from "@prisma/client";
import { compare, hash } from "bcryptjs";

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
  async createUser(data: CreateUserData): Promise<UserWithoutPassword> {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new UserServiceError("User with this email already exists");
      }

      const hashedPassword = await hash(data.password, 12);

      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role: data.role || "USER",
        },
      });

      // Get the user's school information
      const schoolUser = await prisma.schoolUser.findFirst({
        where: { userId: user.id },
        select: {
          schoolId: true,
          role: true,
        },
      });

      const userWithoutPassword = omitPassword(user);

      return {
        ...userWithoutPassword,
        school: schoolUser
          ? {
              id: schoolUser.schoolId,
              role: schoolUser.role,
            }
          : undefined,
      } as UserWithSchool;
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      console.error("Error creating user:", error);
      throw new UserServiceError("Failed to create user");
    }
  },

  async updateUser(
    userId: string,
    data: UpdateUserData
  ): Promise<UserWithoutPassword> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new UserServiceError("User not found");
      }

      if (data.email && data.email !== user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: data.email },
        });

        if (existingUser) {
          throw new UserServiceError("Email already in use");
        }
      }

      const updateData: UpdateUserData = { ...data };
      if (data.password) {
        updateData.password = await hash(data.password, 12);
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      return omitPassword(updatedUser);
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      console.error("Error updating user:", error);
      throw new UserServiceError("Failed to update user");
    }
  },

  async findUserById(userId: string): Promise<UserWithoutPassword | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) return null;

      // Get the user's school information
      const schoolUser = await prisma.schoolUser.findFirst({
        where: { userId: user.id },
        select: {
          schoolId: true,
          role: true,
        },
      });

      const userWithoutPassword = omitPassword(user);

      return {
        ...userWithoutPassword,
        school: schoolUser
          ? {
              id: schoolUser.schoolId,
              role: schoolUser.role,
            }
          : undefined,
      } as UserWithSchool;
    } catch (error) {
      console.error("Error finding user:", error);
      throw new UserServiceError("Failed to find user");
    }
  },

  async findUserByEmail(email: string): Promise<UserWithoutPassword | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) return null;

      // Get the user's school information
      const schoolUser = await prisma.schoolUser.findFirst({
        where: { userId: user.id },
        select: {
          schoolId: true,
          role: true,
        },
      });

      const userWithoutPassword = omitPassword(user);

      return {
        ...userWithoutPassword,
        school: schoolUser
          ? {
              id: schoolUser.schoolId,
              role: schoolUser.role,
            }
          : undefined,
      } as UserWithSchool;
    } catch (error) {
      console.error("Error finding user:", error);
      throw new UserServiceError("Failed to find user");
    }
  },

  async validateUserCredentials(
    email: string,
    password: string
  ): Promise<UserWithSchool> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || !user.password) {
        throw new UserServiceError("Invalid credentials");
      }

      const isValid = await compare(password, user.password);
      if (!isValid) {
        throw new UserServiceError("Invalid credentials");
      }

      // Get the user's school information
      const schoolUser = await prisma.schoolUser.findFirst({
        where: { userId: user.id },
        select: {
          schoolId: true,
          role: true,
        },
      });

      const userWithoutPassword = omitPassword(user);

      return {
        ...userWithoutPassword,
        school: schoolUser
          ? {
              id: schoolUser.schoolId,
              role: schoolUser.role,
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
