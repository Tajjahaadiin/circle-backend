import { Request, Response, NextFunction } from 'express';
import { ValidationError as JoiValidationError } from 'joi';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error('Global Error Handler - Error Caught:', err);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Default to 500 if no status set

  let errors = [];

  if (err instanceof JoiValidationError) {
    statusCode = 400; // Bad Request for validation errors
    errors = err.details.map((detail) => ({ message: detail.message }));
  } else if (err instanceof PrismaClientKnownRequestError) {
    console.error('Prisma Error Code:', err.code);
    if (err.code === 'P2002') {
      statusCode = 409;
      errors = [
        { message: 'Database conflict, username or email is already  exist.' },
      ];
    } else if (err.code === 'P2025') {
      statusCode = 404;
      errors = [{ message: 'Record not found.' }];
    } else {
      statusCode = 500;
      errors = [{ message: 'Database error occurred.' }];
    }
  } else if (err.message === 'file is not allowed') {
    statusCode = 400; // Bad Request
    errors = [
      {
        message:
          'Invalid file type. Only PNG, JPEG, and JPG images are allowed.',
      },
    ];
  } else {
    statusCode = 500;
    errors = [{ message: 'Internal server error occurred.' }];
  }

  res.status(statusCode).json({ errors });
};
