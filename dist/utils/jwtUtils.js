"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret";
const jwtUtils = {
    generateToken(payload, expiresIn = "1h") {
        return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn });
    },
    verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch (error) {
            console.error("Token verification failed", error);
            return null;
        }
    },
    decodeToken(token) {
        try {
            const decode = jsonwebtoken_1.default.decode(token);
            return decode;
        }
        catch (error) {
            console.error("Token decoding failed", error);
            return null;
        }
    },
};
exports.default = jwtUtils;
