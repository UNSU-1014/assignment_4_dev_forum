import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret";

interface TokenPayload {
  userId: number;
  email: string;
}

const jwtUtils = {
  generateToken(payload: TokenPayload, expiresIn: string = "1h"): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  },

  verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      console.error("Token verification failed", error);
      return null;
    }
  },

  decodeToken(token: string): TokenPayload | null {
    try {
      const decode = jwt.decode(token);
      return decode as TokenPayload;
    } catch (error) {
      console.error("Token decoding failed", error);
      return null;
    }
  },
};

export default jwtUtils;
