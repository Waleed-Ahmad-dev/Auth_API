import  User  from '../models/User.js';


export async function Register(req, res) {
     const { first_name, last_name, email, password } = req.body; // Extract the data from the request body

     try {
          // Create a new user with the provided data
          const newUser = new User({
               first_name,
               last_name,
               email,
               password
          });

          // Check if a user with the same email already exists
          const existingUser = await User.findOne({ email });
          if (existingUser) {
               return res.status(400).json({
                    status: 'Failed',
                    data: [],
                    message: 'It seems like you already have an account. Please Log In instead.'
               });
          }

          // Save the new user
          const savedUser = await newUser.save();

          // Destructure role from the saved user and send the response
          const { role, ...user_data } = savedUser._doc;
          res.status(200).json({
               status: 'Success',
               data: [user_data],
               message: 'Thank you for registering! Your account has been successfully created.'
          });
     } catch (err) {
          // Handle any internal server errors
          res.status(500).json({
               status: 'error',
               code: 500,
               data: [],
               message: 'Internal Server Error',
          });
          console.log(err);
     }
}