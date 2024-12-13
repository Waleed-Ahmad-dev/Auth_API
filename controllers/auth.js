import  User  from '../models/User.js';
import bcrypt from 'bcrypt';


export async function Register(req, res) {
     const { first_name, last_name, email, password } = req.body; // Extract the data from the request body

     try {
          const newUser = new User({
               first_name,
               last_name,
               email,
               password
          });

          const existingUser = await User.findOne({ email });
          if (existingUser) {
               return res.status(400).json({
                    status: 'Failed',
                    data: [],
                    message: 'It seems like you already have an account. Please Log In instead.'
               });
          }

          const savedUser = await newUser.save();

          const { role, ...user_data } = savedUser._doc;
          res.status(200).json({
               status: 'Success',
               data: [user_data],
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


export async function Login(req, res) {
     const { email, password } = req.body;

     try {
          const user = await User.findOne({ email }).select("+password");

          if (!user) {
               return res.status(404).json({
                    status: 'Failed',
                    data: [],
                    message: 'User not found'
               });
          }

          const isPasswordValid = await bcrypt.compare(
               `${password}`, 
               `${user.password}` 
          );

          if (!isPasswordValid) {
               return res.status(401).json({
                    status: 'Failed',
                    data: [],
                    message: 'Invalid credentials'
               });
          };

          const { password: userPassword, ...user_data } = user._doc;

          let options = {
               maxAge: 20 * 60 * 1000,
               httpOnly: true,
               secure: true,
               sameSite: "None",
          };

          const token = user.generateAccessJWT();
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
