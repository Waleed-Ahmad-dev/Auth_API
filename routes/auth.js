import express from 'express';
import { DeleteUser, Logout, Register, UpdateUser } from '../controllers/auth.js';
import Validate from '../middleware/validate.js';
import { check } from 'express-validator';
import { Login } from '../controllers/auth.js';
import { Verify, VerifyRole } from '../middleware/verify.js';

const router = express.Router();

router.post(
     '/register',
     check('email')
          .isEmail()
          .withMessage('Enter a valid email address')
          .normalizeEmail(),
     check('first_name')
          .not()
          .isEmpty()
          .withMessage('First name is required')
          .trim()
          .escape(),
     check('last_name')
          .not()
          .isEmpty()
          .withMessage('Last name is required')
          .trim()
          .escape(),
     check('password')
          .notEmpty()
          .isLength({min: 8})
          .withMessage('Password must be at least 8 characters long'),
     Validate,
     Register
);

router.post(
     "/login",
     check("email")
          .isEmail()
          .withMessage("Enter a valid email address")
          .normalizeEmail(),
     check("password")
          .not()
          .isEmpty(),
     Validate,
     Login
);

router.get('/logout', Logout);

router.delete('/delete/:id', Verify, VerifyRole('admin'), DeleteUser);

router.put('/update/:id', Verify, VerifyRole('admin'), UpdateUser);


export default router;