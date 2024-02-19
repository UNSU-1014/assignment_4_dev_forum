"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class BoardService {
    createBoard(title) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.board.create({
                data: {
                    title,
                },
            });
        });
    }
    getAllBoards() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.board.findMany({
                include: {
                    posts: true,
                },
            });
        });
    }
    getBoardById(boardId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.board.findUnique({
                where: { id: boardId },
                include: {
                    posts: true,
                },
            });
        });
    }
    updateBoard(boardId, title) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.board.update({
                where: { id: boardId },
                data: { title },
            });
        });
    }
    deleteBoard(boardId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.post.deleteMany({ where: { boardId } });
            return yield prisma.board.delete({
                where: { id: boardId },
            });
        });
    }
}
exports.BoardService = BoardService;
