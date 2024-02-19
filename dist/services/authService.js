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
exports.authService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtUtils_1 = __importDefault(require("../utils/jwtUtils"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_KEY";
class AuthService {
    register({ email, password, profileId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                throw new Error("유저가 이미 존재합니다.");
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const user = yield prisma.user.create({
                data: {
                    email,
                    encryptedPassword: hashedPassword,
                    profileId,
                },
            });
            const token = jwtUtils_1.default.generateToken({
                userId: user.id,
                email: user.email,
            });
            return { user, token };
        });
    }
    login(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = dto;
            const user = yield prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                throw new Error("유저를 찾을 수 없습니다.");
            }
            const isMatch = yield bcrypt_1.default.compare(password, user.encryptedPassword);
            if (!isMatch) {
                throw new Error("올바르지 않은 패스워드입니다.");
            }
            const token = jwtUtils_1.default.generateToken({ userId: user.id, email });
            return { user, token };
        });
    }
}
exports.authService = new AuthService();
