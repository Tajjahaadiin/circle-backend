import { Request, Response, NextFunction } from 'express';
import { createThreadSchema } from '../utils/schemas/thread.schema';
import * as threadService from '../services/thread.service';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { generateCustomFilename } from '../lib/filename-generator';
import { CreateThreadDTO } from '../dtos/thread.dto';
import likeService from '../services/like.service';

export const getThreads = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt((req.query.page as string) ?? '1', 10);
    const limit = parseInt((req.query.limit as string) ?? '10', 10);
    const startIndex = (page - 1) * limit;
    const pagination = {
      limit,
      startIndex,
    };
    const userId = (req as any).user.id;
    const threadsWithLikesData = await threadService.onGetThreads(
      userId,
      pagination,
    );

    const newThreads = threadsWithLikesData.map((thread) => {
      const likesCount = thread._count?.likes || 0;
      const isLiked = thread.likes.length > 0;

      return {
        ...thread,
        likesCount,
        isLiked,
      };
    });

    res.status(200).json(newThreads);
  } catch (error: any) {
    next(error);
  }
};

export const getThreadById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { id } = req.params;
    const thread = await threadService.onGetThreadById(id);
    if (!thread) {
      return res
        .status(404)
        .json({ errors: [{ message: 'Thread not found' }] });
    }
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
      //generate custom name
      const customFilename = generateCustomFilename(
        req.file.originalname,
        'thread-image',
      );
      // Convert Buffer to Data URI
      const buffer = req.file.buffer;
      const mimeType = req.file.mimetype; // e.g., 'image/jpeg'
      const base64String = buffer.toString('base64');
      const dataUri = `data:${mimeType};base64,${base64String}`;

      try {
        uploadResult = await cloudinary.uploader.upload(dataUri, {
          folder: 'circle-thread-images',
          public_id: customFilename,
        });
      } catch (cloudinaryError) {
        console.error('Cloudinary Upload Error:', cloudinaryError);
        const customError = new Error('Image upload to Cloudinary failed');
        (customError as any).cloudinaryError = cloudinaryError;
        return next(customError);
      }
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
