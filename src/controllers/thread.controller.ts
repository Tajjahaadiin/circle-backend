import { Request, Response, NextFunction } from 'express';
import {
  createThreadSchema,
  updateThreadSchema,
} from '../utils/schemas/thread.schema';
import * as threadService from '../services/thread.service';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { generateCustomFilename } from '../lib/filename-generator';
import { CreateThreadDTO } from '../dtos/thread.dto';
import likeService from '../services/like.service';
import Joi from 'joi';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { validate } from 'uuid';
import { getThreadPublicId } from '../lib/cloudinary-public_id';

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
      const repliesCount = thread._count.replies || 0;

      return {
        ...thread,
        likesCount,
        isLiked,
        repliesCount,
      };
    });

    res.status(200).json(newThreads);
  } catch (error: any) {
    next(error);
  }
};
export const getThreadsByuserID = async (
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
    const { userId } = req.params;
    const threadData = await threadService.onGetThreadsByuserId(
      userId,
      pagination,
    );

    const newThreads = threadData.map((thread) => {
      const likesCount = thread._count?.likes || 0;
      const isLiked = thread.likes.length > 0;
      const repliesCount = thread._count.replies || 0;

      return {
        ...thread,
        likesCount,
        isLiked,
        repliesCount,
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
    console.log('data', thread);

    if (!thread) {
      return res
        .status(404)
        .json({ errors: [{ message: 'Thread not found' }] });
    }
    const isLiked = thread.likes?.length > 0;
    const likesCount = thread?._count.likes || 0;
    const newThreads = { ...thread, isLiked, likesCount };
    console.log('newThread', newThreads);
    res.json(newThreads);
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
export const updateThread = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  /**
    #swagger.path = '/threads/{threadId}'
    #swagger.method = 'post'
    #swagger.summary = 'Update a thread'
    #swagger.description = 'Update thread content and image.'

   #swagger.parameters['threadId'] = {
       in: 'path',
       required: true,
       type: 'string',
       description: 'The ID of the thread to update.'
    }

    #swagger.requestBody = {
              required: true,
              content: {
                  "multipart/form-data": {
                      schema: {
                          $ref: "#/components/schemas/UpdateThreadDTO"
                      }
                  }
              }
          }

    #swagger.responses[200] = {
      description: 'Thread updated successfully.'
    }
   */
  try {
    const { threadId } = req.params;
    const existingThread = await threadService.onGetThreadById(threadId);
    if (!existingThread) {
      throw new BadRequestError('Thread does not exist');
    }
    let uploadResult: UploadApiResponse = {} as UploadApiResponse;
    if (req.file) {
      if (existingThread.images) {
        try {
          const public_id = getThreadPublicId(existingThread.images);
          console.log('this is public_id', public_id);
          if (public_id) {
            await cloudinary.uploader.destroy(public_id);
          }
        } catch (error) {
          console.error('Cloudinary Deletion Error:', error);
          const customError = new Error(
            'Failed to delete previous image from Cloudinary',
          );
          (customError as any).cloudinaryError = error;
        }
      }
      // Generate a custom filename for the new image
      const customFilename = generateCustomFilename(
        req.file.originalname,
        'thread-image',
      );
      console.log('this is custom file name', customFilename);
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
    const updateData = {
      ...req.body,
      images: uploadResult?.secure_url ?? existingThread.images,
    };
    const validatedData = await updateThreadSchema.validateAsync(updateData);

    const updatedThread = await threadService.onUpdateThread(
      threadId,
      validatedData,
    );
    res.json({ message: 'Thread Updated!', data: { ...updatedThread } });
  } catch (error) {
    next(error);
  }
};
export const deleteThread = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { threadId } = req.params;
    let uploadResult: UploadApiResponse = {} as UploadApiResponse;
    const isThreadExist = await threadService.getDeleteThread(threadId);
    console.log('isthreadExist', isThreadExist);
    if (isThreadExist !== null) {
      const user = await threadService.onDeleteThreadById(threadId);
      res.json({ message: 'thread deleted succesfully', user });
      if (isThreadExist.images) {
        try {
          const public_id = getThreadPublicId(isThreadExist.images);
          console.log('this is public_id', public_id);
          if (public_id) {
            await cloudinary.uploader.destroy(public_id);
          }
        } catch (error) {
          console.error('Cloudinary Deletion Error:', error);
          const customError = new Error(
            'Failed to delete previous image from Cloudinary',
          );
          (customError as any).cloudinaryError = error;
        }
      }
    } else {
      throw new NotFoundError('Thread does not exist');
    }
  } catch (error: any) {
    res.status(404).json({ message: `Error: ${error.message}` });
    next(error);
  }
};
