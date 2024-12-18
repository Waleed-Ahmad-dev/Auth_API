import prisma from '../prismaClient.js';
import { SECRET_ACCESS_TOKEN } from '../config/index.js';
import jwt from "jsonwebtoken";

export async function Verify(req, res, next) {
     try {
          const authHeader = req.headers['authorization'] || req.headers['cookie'];
          if (!authHeader) return res.sendStatus(401); 

          const token = authHeader.includes('Bearer') ? authHeader.split(' ')[1] : authHeader.split('=')[1];

          const blacklistedToken = await prisma.blacklist.findUnique({
               where: { token },
          });
          if (blacklistedToken) {
               return res.status(401).json({ message: 'Token has been invalidated. Please login again.' });
          }

          jwt.verify(token, SECRET_ACCESS_TOKEN, async (err, decoded) => {
               if (err) {
                    return res.status(401).json({ message: 'Invalid or expired token. Please login again.' });
               }


          const user = await prisma.user.findUnique({
               where: { id: decoded.id },
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

export function VerifyRole(requiredRole) {
     return (req, res, next) => {
          try {
          const user = req.user;
     
          if (!user || user.role !== requiredRole) {
               return res.status(403).json({
                    message: 'Forbidden: You do not have the necessary permissions to access this resource.',
               });
          }
     
          next();
          } catch (err) {
               console.error(err);
               res.status(500).json({ message: 'Internal server error.' });
          }
     };
}