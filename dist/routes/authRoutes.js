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
const authService_1 = require("../services/authService");
const authRoutes = (0, express_1.Router)();
authRoutes.post("/sign-up", [
    (0, express_validator_1.body)("email").isEmail().withMessage("유효한 이메일 주소를 제공하세요"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("비밀번호는 6자리 이상이어야 합니다."),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password, profileId } = req.body;
        const result = yield authService_1.authService.register({ email, password, profileId });
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json(error.message);
    }
}));
authRoutes.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const result = yield authService_1.authService.login({ email, password });
        res.json(result);
    }
    catch (error) {
        res.status(401).json(error.message);
    }
}));
exports.default = authRoutes;
