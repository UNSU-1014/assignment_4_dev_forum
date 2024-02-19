import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { BoardService } from "../services/boardService";

const boardRoutes = Router();
const boardService = new BoardService();

boardRoutes.post(
  "/",
  [body("title").trim().notEmpty().withMessage("A board title is required.")],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title } = req.body;
      const board = await boardService.createBoard(title);
      res.status(201).json(board);
    } catch (error) {
      res.status(500).json((error as Error).message);
    }
  }
);

boardRoutes.get("/", async (_, res: Response) => {
  try {
    const boards = await boardService.getAllBoards();
    res.json(boards);
  } catch (error) {
    res.status(500).json((error as Error).message);
  }
});

boardRoutes.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const boardId = parseInt(id);
    const board = await boardService.getBoardById(boardId);
    if (board) {
      res.json(board);
    } else {
      res.status(404).json({ message: "Board not found." });
    }
  } catch (error) {
    res.status(500).json((error as Error).message);
  }
});

boardRoutes.put(
  "/:id",
  [body("title").trim().notEmpty().withMessage("A new title is required.")],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title } = req.body;
    try {
      const boardId = parseInt(id);
      const updatedBoard = await boardService.updateBoard(boardId, title);
      res.json(updatedBoard);
    } catch (error) {
      res.status(500).json((error as Error).message);
    }
  }
);

boardRoutes.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const boardId = parseInt(id);
    await boardService.deleteBoard(boardId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json((error as Error).message);
  }
});

export default boardRoutes;
