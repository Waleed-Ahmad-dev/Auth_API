var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from '../prismaClient.js';
import { SECRET_ACCESS_TOKEN } from '../config/index.js';
import jwt from "jsonwebtoken";
export function Verify(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authHeader = req.headers['authorization'] || req.headers['cookie'];
            if (!authHeader)
                return;
            const token = authHeader.includes('Bearer') ? authHeader.split(' ')[1] : authHeader.split('=')[1];
            const blacklistedToken = yield prisma.blacklists.findUnique({
                where: { token },
            });
            if (blacklistedToken) {
                return;
            }
            if (!SECRET_ACCESS_TOKEN) {
                throw new Error('SECRET_ACCESS_TOKEN is not defined');
            }
            jwt.verify(token, SECRET_ACCESS_TOKEN, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return res.status(401).json({ message: 'Invalid or expired token. Please login again.' });
                }
                const { id } = decoded;
                const user = yield prisma.user.findUnique({
                    where: { id },
                    select: { id: true, email: true, role: true },
                });
                if (!user) {
                    return res.status(404).json({ message: 'User not found.' });
                }
                req.user = user;
                next();
            }));
        }
        catch (err) {
            res.status(500).json({
                status: "error",
                code: 500,
                data: [],
                message: "Internal Server Error",
            });
            console.log(err);
        }
    });
}
export function VerifyRole(requiredRole) {
    return (req, res, next) => {
        try {
            const user = req.user;
            if (!user || user.role !== requiredRole) {
                res.status(403).json({
                    message: 'Forbidden: You do not have the necessary permissions to access this resource.',
                });
                return;
            }
            next();
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error.' });
        }
    };
}
