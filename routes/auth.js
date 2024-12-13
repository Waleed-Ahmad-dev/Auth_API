import express from 'express';
import { Register } from '../controllers/auth.js';
import Validate from '../middleware/validate.js';
import { check } from 'express-validator';
import { Login } from '../controllers/auth.js';

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

export default router;