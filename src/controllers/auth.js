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
import prisma from '../prismaClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SECRET_ACCESS_TOKEN } from '../config/index.js';
export function Register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { first_name, last_name, email, password } = req.body;
        const hashedPassword = yield bcrypt.hash(password, 10);
        try {
            const existingUser = yield prisma.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                res.status(400).json({
                    status: 'Failed',
                    data: [],
                    message: 'It seems like you already have an account. Please Log In instead.'
                });
            }
            ;
            const newUser = yield prisma.user.create({
                data: {
                    first_name,
                    last_name,
                    email,
                    password: hashedPassword,
                },
            });
            res.status(200).json({
                status: 'Success',
                data: {
                    first_name: newUser.first_name,
                    last_name: newUser.last_name,
                    email: newUser.email,
                },
                message: 'Thank you for registering! Your account has been successfully created.'
            });
        }
        catch (err) {
            res.status(500).json({
                status: 'error',
                code: 500,
                data: [],
                message: 'Internal Server Error',
            });
            console.log(err);
        }
    });
}
;
export function Login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const user = yield prisma.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    password: true,
                },
            });
            if (!user) {
                res.status(404).json({
                    status: 'Failed',
                    data: [],
                    message: 'User not found'
                });
                throw new Error("User not found");
            }
            const isPasswordValid = yield bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({
                    status: 'Failed',
                    data: [],
                    message: 'Invalid credentials'
                });
            }
            ;
            const { password: _ } = user, user_data = __rest(user, ["password"]);
            let options = {
                maxAge: 20 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: "none",
            };
            if (!SECRET_ACCESS_TOKEN) {
                res.status(403).json({
                    status: 'Failed',
                    data: [],
                    message: 'No secret access token found'
                });
            }
            if (!SECRET_ACCESS_TOKEN) {
                throw new Error('SECRET_ACCESS_TOKEN is not defined');
            }
            if (!user) {
                throw new Error('User not found');
            }
            const token = jwt.sign({ id: user.id }, SECRET_ACCESS_TOKEN, { expiresIn: '20m' });
            res.cookie("SessionID", token, options);
            res.status(200).json({
                status: 'Success',
                data: [user_data],
                message: 'Logged in successfully'
            });
        }
        catch (err) {
            res.status(500).json({
                status: 'error',
                code: 500,
                data: [],
                message: 'Internal Server Error'
            });
            console.log(err);
        }
        res.end();
    });
}
export function Logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authHeader = req.headers['cookie'];
            if (!authHeader)
                return;
            const cookie = authHeader.split('=')[1];
            const accessToken = cookie.split(';')[0];
            const checkIfBlacklisted = yield prisma.blacklists.findUnique({
                where: { token: accessToken },
            });
            if (checkIfBlacklisted)
                return;
            yield prisma.blacklists.create({
                data: { token: accessToken },
            });
            res.clearCookie('SessionID', {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            res.status(200).json({ message: 'You are logged out!' });
        }
        catch (err) {
            res.status(500).json({
                status: 'error',
                message: 'Internal Server Error',
            });
        }
        res.end();
    });
}
export function DeleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const user = yield prisma.user.findUnique({
                where: { id: parseInt(req.params.id) },
            });
            if (!user) {
                res.status(404).json({
                    status: 'Failed',
                    data: [],
                    message: 'User not found'
                });
            }
            ;
            yield prisma.user.delete({ where: { id: parseInt(req.params.id) } });
            res.status(200).json({
                status: 'Success',
                data: [],
                message: 'User deleted successfully'
            });
        }
        catch (err) {
            res.status(500).json({
                status: 'error',
                message: 'Internal Server Error',
            });
        }
    });
}
export function UpdateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const { first_name, last_name, email, password } = req.body;
        try {
            const user = yield prisma.user.findUnique({ where: { id: parseInt(id) } });
            if (!user) {
                res.status(404).json({
                    status: 'Failed',
                    data: [],
                    message: 'User not found'
                });
            }
            ;
            if (!user) {
                throw new Error('User not found');
            }
            let hashedPassword;
            if (password) {
                hashedPassword = yield bcrypt.hash(password, 10);
            }
            else {
                hashedPassword = user.password;
            }
            const updatedUser = yield prisma.user.update({
                where: { id: parseInt(id) },
                data: Object.assign(Object.assign(Object.assign(Object.assign({}, (first_name && { first_name })), (last_name && { last_name })), (email && { email })), (hashedPassword && { password: hashedPassword })),
            });
            res.status(200).json({
                status: 'Success',
                data: updatedUser,
                message: 'User updated successfully'
            });
        }
        catch (err) {
            res.status(500).json({
                status: 'error',
                message: 'Internal Server Error',
            });
        }
    });
}
