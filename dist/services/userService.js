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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
class UserService {
    // Create a new user with hashed password and optional profile
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password } = data, userData = __rest(data, ["password"]);
            const encryptedPassword = yield bcrypt_1.default.hash(password, 12); // Adjust salt rounds as necessary
            const user = yield prisma.user.create({
                data: Object.assign(Object.assign({}, userData), { encryptedPassword, 
                    // Assuming a one-to-one relation with profile for demonstration
                    profile: {
                        create: {
                            nickname: userData.nickname,
                            name: userData.name,
                            gender: userData.gender,
                            age: userData.age,
                        },
                    } }),
                select: {
                    id: true,
                    email: true,
                    profile: true, // Adjust based on your needs
                    createdAt: true,
                },
            });
            return user;
        });
    }
    // Retrieve all users, excluding encrypted passwords
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    profile: true, // Adjust based on your needs
                    createdAt: true,
                },
            });
        });
    }
    // Retrieve a single user by ID, excluding encrypted password
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    profile: true, // Adjust based on your needs
                    createdAt: true,
                },
            });
        });
    }
    // Update a user's information by ID
    updateUser(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            // For simplicity, assuming direct update without handling password changes here
            return yield prisma.user.update({
                where: { id: userId },
                data: {
                    email: updateData.email,
                    profile: {
                        update: {
                            nickname: updateData.nickname,
                            name: updateData.name,
                            gender: updateData.gender,
                            age: updateData.age,
                        },
                    },
                },
                select: {
                    id: true,
                    email: true,
                    profile: true, // Adjust based on your needs
                    createdAt: true,
                },
            });
        });
    }
    // Delete a user by ID
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.user.delete({ where: { id: userId } });
        });
    }
}
exports.userService = new UserService();
