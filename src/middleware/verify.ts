import prisma from '../prismaClient.js';
import { SECRET_ACCESS_TOKEN } from '../config/index.js';
import jwt from "jsonwebtoken";
import { CustomRequest, CustomResponse } from '../types/index.js';
import { NextFunction } from 'express';

export async function Verify(req: CustomRequest, res: CustomResponse, next: NextFunction): Promise<void> {
     try {
          const authHeader = req.headers['authorization'] || req.headers['cookie'];
          if (!authHeader) return; 

          const token = authHeader.includes('Bearer') ? authHeader.split(' ')[1] : authHeader.split('=')[1];

          const blacklistedToken = await prisma.blacklists.findUnique({
               where: { token },
          });
          if (blacklistedToken) {
               return;
          }

          if (!SECRET_ACCESS_TOKEN) {
               throw new Error('SECRET_ACCESS_TOKEN is not defined');
          }

          jwt.verify(token, SECRET_ACCESS_TOKEN, async (err, decoded) => {
               if (err) {
                    return res.status(401).json({ message: 'Invalid or expired token. Please login again.' });
               }


               const { id } = decoded as { id: number };

          const user = await prisma.user.findUnique({
               where: { id },
               select: { id: true, email: true, role: true },
          });
          if (!user) {
               return res.status(404).json({ message: 'User not found.' });
          }

          req.user = user;
          next();
          });
     } catch (err) {
          res.status(500).json({
               status: "error",
               code: 500,
               data: [],
               message: "Internal Server Error",
          });
          console.log(err)
     }
}


export function VerifyRole(requiredRole: 'USER' | 'ADMIN'): (req: CustomRequest, res: CustomResponse, next: NextFunction) => void {
     return (req: CustomRequest, res: CustomResponse, next: NextFunction): void => {
          try {
               const user = req.user;

               if (!user || user.role !== requiredRole) {
                    res.status(403).json({
                         message: 'Forbidden: You do not have the necessary permissions to access this resource.',
                    });
                    return;
               }

               next();
          } catch (err) {
               console.error(err);
               res.status(500).json({ message: 'Internal server error.' });
          }
     };
}
