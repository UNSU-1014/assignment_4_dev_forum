import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class BoardService {
  async createBoard(title: string) {
    return await prisma.board.create({
      data: {
        title,
      },
    });
  }
  async getAllBoards() {
    return await prisma.board.findMany({
      include: {
        posts: true,
      },
    });
  }

  async getBoardById(boardId: number) {
    return await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        posts: true,
      },
    });
  }

  async updateBoard(boardId: number, title: string) {
    return await prisma.board.update({
      where: { id: boardId },
      data: { title },
    });
  }

  async deleteBoard(boardId: number) {
    await prisma.post.deleteMany({ where: { boardId } });
    return await prisma.board.delete({
      where: { id: boardId },
    });
  }
}
