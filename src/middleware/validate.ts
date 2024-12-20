import { validationResult } from 'express-validator';
import { CustomRequest, CustomResponse, ExtendedValidationError } from '../types';
import { NextFunction } from 'express';


const Validate = (req: CustomRequest, res: CustomResponse, next: NextFunction): void => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error: { [key: string]: string } = {};
          errors.array().forEach((err: ExtendedValidationError) => {
               error[err.param] = err.msg;
          });
          console.error('Validation errors:', error);
          return;
     }
     next();
};

export default Validate;