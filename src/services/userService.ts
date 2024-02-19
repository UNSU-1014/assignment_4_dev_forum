import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

class UserService {
  // Create a new user with hashed password and optional profile
  async createUser(data: {
    email: string;
    password: string;
    nickname?: string;
    name?: string;
    gender?: string;
    age?: number;
  }): Promise<Omit<User, "encryptedPassword">> {
    const { password, ...userData } = data;
    const encryptedPassword = await bcrypt.hash(password, 12); // Adjust salt rounds as necessary

    const user = await prisma.user.create({
      data: {
        ...userData,
        encryptedPassword,
        // Assuming a one-to-one relation with profile for demonstration
        profile: {
          create: {
            nickname: userData.nickname,
            name: userData.name,
            gender: userData.gender,
            age: userData.age,
          },
        },
      },
      select: {
        id: true,
        email: true,
        profile: true, // Adjust based on your needs
        createdAt: true,
      },
    });

    return user;
  }

  // Retrieve all users, excluding encrypted passwords
  async getUsers(): Promise<Omit<User, "encryptedPassword">[]> {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        profile: true, // Adjust based on your needs
        createdAt: true,
      },
    });
  }

  // Retrieve a single user by ID, excluding encrypted password
  async getUserById(
    userId: number
  ): Promise<Omit<User, "encryptedPassword"> | null> {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        profile: true, // Adjust based on your needs
        createdAt: true,
      },
    });
  }

  // Update a user's information by ID
  async updateUser(
    userId: number,
    updateData: {
      email?: string;
      nickname?: string;
      name?: string;
      gender?: string;
      age?: number;
    }
  ): Promise<Omit<User, "encryptedPassword">> {
    // For simplicity, assuming direct update without handling password changes here
    return await prisma.user.update({
      where: { id: userId },
      data: {
        email: updateData.email,
        profile: {
          update: {
            nickname: updateData.nickname,
            name: updateData.name,
            gender: updateData.gender,
            age: updateData.age,
          },
        },
      },
      select: {
        id: true,
        email: true,
        profile: true, // Adjust based on your needs
        createdAt: true,
      },
    });
  }

  // Delete a user by ID
  async deleteUser(userId: number): Promise<void> {
    await prisma.user.delete({ where: { id: userId } });
  }
}

export const userService = new UserService();
