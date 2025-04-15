import { Request, Response, NextFunction } from 'express';
import { ValidationError as JoiValidationError } from 'joi';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { BadRequestError, NotFoundError } from '../utils/errors';
interface CustomError extends Error {
  statusCode?: number;
}
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error('Global Error Handler - Error Caught:', err);

  let statusCode: number = res.statusCode !== 200 ? res.statusCode : 500; // Default to 500 if no status set

  let errors: { message: string }[] = [];

  if (err instanceof BadRequestError) {
    // Custom error thrown from our application
    statusCode = err.statusCode || 400;
    errors.push({ message: `${err.message}` });
  } else if (err instanceof JoiValidationError) {
    // Joi validation errors
    statusCode = 400;
    errors = err.details.map((detail) => ({ message: detail.message }));
  } else if (err instanceof PrismaClientKnownRequestError) {
    // Prisma-specific errors with known codes
    console.error('Prisma Error Code:', err.code);
    if (err.code === 'P2002') {
      statusCode = 409;
      errors.push({
        message: 'Database conflict, username or email already exists.',
      });
    } else if (err.code === 'P2025') {
      statusCode = 404;
      errors.push({ message: 'Record not found.' });
    } else {
      statusCode = 500;
      errors.push({ message: 'Database error occurred.' });
    }
  } else if (err.message === 'file is not allowed') {
    // Specific file validation error
    statusCode = 400;
    errors.push({
      message: 'Invalid file type. Only PNG, JPEG, and JPG images are allowed.',
    });
  } else if (err instanceof NotFoundError) {
    statusCode = err.statusCode || 404;
    errors.push({ message: `${err.name}:${err.message}` });
  } else {
    // Fallback for other errors
    statusCode = err.statusCode || 500;
    errors.push({
      message: err.message || 'Internal server error occurred.',
    });
  }

  // Prepare a consistent error response payload.
  const errorResponse: any = { errors };

  // Optionally include the stack trace for non-production environments.
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};
