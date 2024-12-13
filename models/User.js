import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_ACCESS_TOKEN } from "../config/index.js";


const UserSchema = new mongoose.Schema(
     {
          first_name: {
               type: String,
               require: 'your First Name is Required',
               max: 25,
          },
          last_name: {
               type: String,
               require: 'your Last Name is Required',
               max: 25,
          },
          email: {
               type: String,
               required: 'your Email is Required',
               unique: true,
               lowercase: true,
               trim: true,
          },
          password: {
               type: String,
               required: 'your Password is Required',
               select: false,
               minlength: 8,
          },
          role: {
               type: String,
               enum: ['user', 'admin'],
               default: 'user',
          },
     },
     {
          timestamps: true,
     }
);

UserSchema.pre('save', function (next) {
     const user = this;


     if(!user.isModified('password')) return next();
     bcrypt.genSalt(10, (err, salt) => {
          if(err) return next(err);

          bcrypt.hash(user.password, salt, (err, hash) => {
               if(err) return next(err);

               user.password = hash;
               next();
          });
     });
});


UserSchema.methods.generateAccessJWT = function (){
     let payload = {
          id: this._id,
     };
     return jwt.sign(payload, SECRET_ACCESS_TOKEN, { expiresIn: '20m' });
};

export default mongoose.model('users', UserSchema)