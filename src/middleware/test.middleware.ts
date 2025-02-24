import { Request, Response, NextFunction } from 'express';
import { request } from 'http';

export function testingMiddleware(reqtype: string) {
  return (request: Request, response: Response, next: NextFunction) => {
    console.log(`${reqtype}`);
    next();
  };
}
