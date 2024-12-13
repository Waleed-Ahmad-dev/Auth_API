import { validationResult } from 'express-validator';

const Validate = (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = {};
          errors.array().forEach((err) => {
               error[err.param] = err.msg;
          });
          console.error('Validation errors:', error);
          return res.status(422).json({ error });
     }
     next();
};

export default Validate;