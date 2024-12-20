import { Request, Response } from 'express';
import { ValidationError as ExpressValidationError } from 'express-validator';


export interface ExtendedValidationError extends Record<string, any> {
     customProperty?: string;
}


export interface CustomRequest extends Request {
     user?: {
          id: number;
          email: string;
          role: 'USER' | 'ADMIN';
     };
}
export type CustomResponse = Response;


export interface User {
     id: number;
     first_name: string;
     last_name: string;
     email: string;
     password: string;
     role: 'USER' | 'ADMIN';
     created_at: Date;
     updated_at: Date;
}

export interface JwtPayload {
     id: number;
}

export function getErrorMessage(error: unknown): string {
     if (error instanceof Error) {
          return error.message;
     }
     return 'An unknown error occurred';
}