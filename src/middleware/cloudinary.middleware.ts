import { v2 as cloudinary } from 'cloudinary';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

export function initCloudinary(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME || '';
  const api_key = process.env.CLOUDINARY_API_KEY || '';
  const api_secret = process.env.CLOUDINARY_API_SECRET || '';

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
  });

  next();
}
