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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const client_1 = require("@prisma/client");
const jwtUtils_1 = __importDefault(require("../utils/jwtUtils"));
const prisma = new client_1.PrismaClient();
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1]; // Assuming 'Bearer TOKEN'
    if (!token) {
        return res
            .status(401)
            .send({ message: "Authentication token is required." });
    }
    const decoded = jwtUtils_1.default.verifyToken(token);
    if (!decoded) {
        return res.status(401).send({ message: "Invalid or expired token." });
    }
    try {
        const user = yield prisma.user.findUnique({
            where: { id: decoded.userId },
        });
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Error fetching user from DB", error);
        return res
            .status(500)
            .send({ message: "Error verifying authentication token." });
    }
});
exports.authMiddleware = authMiddleware;
