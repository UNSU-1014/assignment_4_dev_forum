import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwtUtils from "../utils/jwtUtils";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_KEY";

interface RegisterDTO {
  email: string;
  password: string;
  profileId?: number;
}

interface LoginDTO {
  email: string;
  password: string;
}

class AuthService {
  async register({ email, password, profileId }: RegisterDTO) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("유저가 이미 존재합니다.");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        encryptedPassword: hashedPassword,
        profileId,
      },
    });
    const token = jwtUtils.generateToken({
      userId: user.id,
      email: user.email,
    });
    return { user, token };
  }

  async login(dto: LoginDTO) {
    const { email, password } = dto;

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new Error("유저를 찾을 수 없습니다.");
    }

    const isMatch = await bcrypt.compare(password, user.encryptedPassword);
    if (!isMatch) {
      throw new Error("올바르지 않은 패스워드입니다.");
    }

    const token = jwtUtils.generateToken({ userId: user.id, email });
    return { user, token };
  }
}

export const authService = new AuthService();
