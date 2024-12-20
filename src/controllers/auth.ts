import prisma from '../prismaClient.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { SECRET_ACCESS_TOKEN } from '../config/index.js';
import { CustomRequest, CustomResponse } from '../types/index.js';
import { CookieOptions } from 'express';

export async function Register(req: CustomRequest, res: CustomResponse): Promise<void> {
     const { first_name, last_name, email, password } = req.body;

     const hashedPassword = await bcrypt.hash(password, 10)

     try {
          const existingUser = await prisma.user.findUnique({
               where: { email },
          });
          if (existingUser) {
               res.status(400).json({
                    status: 'Failed',
                    data: [],
                    message: 'It seems like you already have an account. Please Log In instead.'
               });
          };
          const newUser = await prisma.user.create({
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
     } catch (err) {
          res.status(500).json({
               status: 'error',
               code: 500,
               data: [],
               message: 'Internal Server Error',
          });
          console.log(err);
     }
};


export async function Login(req: CustomRequest, res: CustomResponse): Promise<void> {
     const { email, password } = req.body;

     try {
          const user = await prisma.user.findUnique({
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
               throw new Error("User not found")
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
               res.status(401).json({
                    status: 'Failed',
                    data: [],
                    message: 'Invalid credentials'
               });
          };

          const { password: _, ...user_data } = user;

          let options: CookieOptions = {
               maxAge: 20 * 60 * 1000,
               httpOnly: true,
               secure: true,
               sameSite: "none",
          }

          if (!SECRET_ACCESS_TOKEN) {
               res.status(403).json({
                    status: 'Failed',
                    data: [],
                    message: 'No secret access token found'
               })
          }

          if(!SECRET_ACCESS_TOKEN) {
               throw new Error('SECRET_ACCESS_TOKEN is not defined');
          }

          if(!user) {
               throw new Error('User not found');
          }

          const token = jwt.sign({ id: user.id }, SECRET_ACCESS_TOKEN, { expiresIn: '20m' });

          res.cookie("SessionID", token, options);

          res.status(200).json({
               status: 'Success',
               data: [user_data],
               message: 'Logged in successfully'
          });
     } catch (err) {
          res.status(500).json({
               status: 'error',
               code: 500,
               data: [],
               message: 'Internal Server Error'
          });
          console.log(err);
     }
     res.end();
}


export async function Logout(req: CustomRequest, res: CustomResponse): Promise<void> {
     try {
          const authHeader = req.headers['cookie']; 
          if (!authHeader) return; 


          const cookie = authHeader.split('=')[1]; 
          const accessToken = cookie.split(';')[0];


          const checkIfBlacklisted = await prisma.blacklists.findUnique({
               where: { token: accessToken },
          }); 
          if (checkIfBlacklisted) return;

          await prisma.blacklists.create({
               data: { token: accessToken },
          });
          res.clearCookie('SessionID', {
               httpOnly: true,
               secure: true,
               sameSite: "none",
          });
          res.status(200).json({ message: 'You are logged out!' });
     } catch (err) {
          res.status(500).json({
               status: 'error',
               message: 'Internal Server Error',
          });
     }
     res.end();
}

export async function DeleteUser(req: CustomRequest, res: CustomResponse): Promise<void> {
     const { id } = req.params;
     try {
          const user = await prisma.user.findUnique({
               where: { id: parseInt(req.params.id) },
          });
          if (!user) {
               res.status(404).json({
                    status: 'Failed',
                    data: [],
                    message: 'User not found'
               });
          };
          await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
          res.status(200).json({ 
               status: 'Success',
               data: [],
               message: 'User deleted successfully'
          });
     } catch (err) {
          res.status(500).json({
               status: 'error',
               message: 'Internal Server Error',
          });
     }
}

export async function UpdateUser(req: CustomRequest, res: CustomResponse): Promise<void> {
     const { id } = req.params;
     const { first_name, last_name, email, password } = req.body;

     try {
          const user = await prisma.user.findUnique({where: {id: parseInt(id)} });

          if(!user) {
               res.status(404).json({
                    status: 'Failed',
                    data: [],
                    message: 'User not found'
               });
          };

          if(!user){
               throw new Error('User not found');
          }

          let hashedPassword;
          if(password) {
               hashedPassword = await bcrypt.hash(password, 10);
          } else {
               hashedPassword = user.password;
          }

          const updatedUser = await prisma.user.update({
               where: { id: parseInt(id) },
               data: {
                    ...(first_name && { first_name }),
                    ...(last_name && { last_name }),
                    ...(email && { email }),
                    ...(hashedPassword && { password: hashedPassword }),
               },
          });
          res.status(200).json({ 
               status: 'Success',
               data: updatedUser,
               message: 'User updated successfully'
          });
     } catch (err) {
          res.status(500).json({
               status: 'error',
               message: 'Internal Server Error',
          });
     }
}