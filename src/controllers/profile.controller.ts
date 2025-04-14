import { NextFunction, Request, Response } from 'express';
import profileService from '../services/profile.service';
import { updateProfileSchema } from '../utils/schemas/update.profile.schema';
import { UpdateProfileDTO } from '../dtos/user.dto';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { generateCustomFilename } from '../lib/filename-generator';

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  /*  #swagger.requestBody = {
              required: true,
              content: {
                  "multipart/form-data": {
                      schema: {
                          $ref: "#/components/schemas/UpdateProfileDTO"
                      }
                  }
              }
          }
      */
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const clientData: Omit<UpdateProfileDTO, 'avatarUrl'> = req.body;
    const validDataWithoutAvatar =
      await updateProfileSchema.validateAsync(clientData);
    let avatarUrl: string | null | undefined; // Allow null as well
    if (req.file) {
      try {
        const customFilename = generateCustomFilename(
          req.file.originalname,
          'avatar',
        );
        const buffer = req.file.buffer;
        const mimeType = req.file.mimetype;
        const base64String = buffer.toString('base64');
        const dataUri = `data:${mimeType};base64,${base64String}`;

        const uploadResult: UploadApiResponse =
          await cloudinary.uploader.upload(dataUri, {
            folder: 'circle-avatars', // You can create a specific folder for avatars
            public_id: customFilename,
          });
        avatarUrl = uploadResult.secure_url;
      } catch (cloudinaryError) {
        console.error('Cloudinary Avatar Upload Error:', cloudinaryError);
        return res
          .status(500)
          .json({ message: 'Failed to upload avatar to Cloudinary' });
      }
    } else {
      avatarUrl = null;
    }

    const updatedUser = await profileService.updateProfile(userId, {
      ...validDataWithoutAvatar,
      avatarUrl,
    });

    res
      .status(200)
      .json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Failed to update profile', error: error.message });
    next(error);
  }
};
