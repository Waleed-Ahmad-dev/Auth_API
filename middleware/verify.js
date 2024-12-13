import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function Verify(req, res, next) {
     try {
          const authHeader = req.header["cookie"];

          if (!authHeader) return res.sendStatus(401);
          const cookie = authHeader.split("=")[1];

          jwt.verify(cookie, config.SECRET_ACCESS_TOKEN, async (err, decoded) => {
               if(err){
                    return res
                              .status(401)
                              .json({message: "This session has expired"})
               }

               const {id} = decoded
               const user = await User.findById(id);
               const { password, ...data } = user._doc;
               request.user = data;
               next();
          })
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

export function VerifyRole(req, res, next) {
     try {
          const user = req.user;
          const { role } = user;

          if (role !== "admin") {
               return res.status(401).json({
                    status: "failed",
                    message: "You are not authorized to view this page.",
               });
          }
          next();
     } catch (err) {
          res.status(500).json({
               status: "error",
               code: 500,
               data: [],
               message: "Internal Server Error",
          });
          console.log(err);
     }
}