import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { authService } from "../services/authService";

const authRoutes = Router();

authRoutes.post(
  "/sign-up",
  [
    body("email").isEmail().withMessage("유효한 이메일 주소를 제공하세요"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("비밀번호는 6자리 이상이어야 합니다."),
  ],

  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password, profileId } = req.body;
      const result = await authService.register({ email, password, profileId });
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json((error as Error).message);
    }
  }
);

authRoutes.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.json(result);
  } catch (error) {
    res.status(401).json((error as Error).message);
  }
});

export default authRoutes;
