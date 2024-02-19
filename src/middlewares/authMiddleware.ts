import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { IUser } from "../types/userTypes";
import jwtUtils from "../utils/jwtUtils";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: IUser; // Assuming IUser is your full user interface
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; // Assuming 'Bearer TOKEN'

  if (!token) {
    return res
      .status(401)
      .send({ message: "Authentication token is required." });
  }

  const decoded = jwtUtils.verifyToken(token);
  if (!decoded) {
    return res.status(401).send({ message: "Invalid or expired token." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Error fetching user from DB", error);
    return res
      .status(500)
      .send({ message: "Error verifying authentication token." });
  }
};
