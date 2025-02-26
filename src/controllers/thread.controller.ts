import { Request, Response, NextFunction } from 'express';
import { createThreadSchema } from '../utils/schemas/thread.schema';
import * as threadService from '../services/thread.service';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import fs from 'fs';

export const getThreads = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const threads = await threadService.onGetThreads();
    res.json(threads);
  } catch (error: any) {
    next(error);
  }
};
export const getThreadById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const thread = await threadService.onGetThreadById(id);
    res.json(thread);
  } catch (error: any) {
    next(error);
  }
};
export const createThread = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  /*  #swagger.requestBody = {
              required: true,
              content: {
                  "multipart/form-data": {
                      schema: {
                          $ref: "#/components/schemas/CreateThreadDTO"
                      }
                  }
              }
          }
      */
  try {
    let uploadResult: UploadApiResponse = {} as UploadApiResponse;
    if (req.file) {
      uploadResult = await cloudinary.uploader.upload(req.file?.path || '');
      fs.unlinkSync(req.file.path);
    }
    const body = {
      ...req.body,
      images: uploadResult?.secure_url ?? undefined,
    };
    const userId = (req as any).user.id;
    const validatedBody = await createThreadSchema.validateAsync(body);
    const thread = await threadService.onCreateThread(userId, validatedBody);
    res.json({
      message: 'Thread created!',
      data: { ...thread },
    });
  } catch (error) {
    next(error);
  }
};
