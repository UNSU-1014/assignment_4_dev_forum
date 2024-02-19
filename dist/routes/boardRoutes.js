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
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const boardService_1 = require("../services/boardService");
const boardRoutes = (0, express_1.Router)();
const boardService = new boardService_1.BoardService();
boardRoutes.post("/", [(0, express_validator_1.body)("title").trim().notEmpty().withMessage("A board title is required.")], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title } = req.body;
        const board = yield boardService.createBoard(title);
        res.status(201).json(board);
    }
    catch (error) {
        res.status(500).json(error.message);
    }
}));
boardRoutes.get("/", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const boards = yield boardService.getAllBoards();
        res.json(boards);
    }
    catch (error) {
        res.status(500).json(error.message);
    }
}));
boardRoutes.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const boardId = parseInt(id);
        const board = yield boardService.getBoardById(boardId);
        if (board) {
            res.json(board);
        }
        else {
            res.status(404).json({ message: "Board not found." });
        }
    }
    catch (error) {
        res.status(500).json(error.message);
    }
}));
boardRoutes.put("/:id", [(0, express_validator_1.body)("title").trim().notEmpty().withMessage("A new title is required.")], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const { title } = req.body;
    try {
        const boardId = parseInt(id);
        const updatedBoard = yield boardService.updateBoard(boardId, title);
        res.json(updatedBoard);
    }
    catch (error) {
        res.status(500).json(error.message);
    }
}));
boardRoutes.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const boardId = parseInt(id);
        yield boardService.deleteBoard(boardId);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json(error.message);
    }
}));
exports.default = boardRoutes;
