import User from "../models/User.js";

export async function CheckUser(req, res, next) {
     try {
          const authHeader = req.headers["cookie"];
          if (!authHeader) {
               return res.status(401).json({
                    status: "Failed",
                    message: "Authentication required.",
               });
          }

          const { user } = req;

          if (!user || !user.id) {
               return res.status(400).json({
                    status: "Failed",
                    message: "Invalid user ID.",
               });
          }
          const existingUser = await User.findById(user.id);
               if (!existingUser) {
                    return res.status(404).json({
                         status: "Failed",
                         message: "User not found.",
                    });
               }

          req.userDetails = existingUser;

          next();
     } catch (err) {
          console.error("Error in CheckUser middleware:", err);
          return res.status(500).json({
               status: "Error",
               message: "Internal Server Error.",
          });
     }
}
