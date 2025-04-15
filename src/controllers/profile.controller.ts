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
interface MulterFiles {
  avatarUrl?: Express.Multer.File[];
  bannerUrl?: Express.Multer.File[];
}
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

    const clientData: Omit<UpdateProfileDTO, 'avatarUrl' | 'bannerUrl'> =
      req.body;
    const validDataWithoutAvatar =
      await updateProfileSchema.validateAsync(clientData);
    const files = req.files as MulterFiles;
    const uploadToCloudinary = async (
      file: Express.Multer.File,
      folder: string,
      prefix: string,
    ): Promise<string | null> => {
      try {
        const customFilename = generateCustomFilename(
          file.originalname,
          prefix,
        );
        const base64String = file.buffer.toString('base64');
        const dataUri = `data:${file.mimetype};base64,${base64String}`;

        const uploadResult: UploadApiResponse =
          await cloudinary.uploader.upload(dataUri, {
            folder,
            public_id: customFilename,
          });

        return uploadResult.secure_url;
      } catch (err) {
        console.error(`Cloudinary ${prefix} Upload Error:`, err);
        return null;
      }
    };

    const avatarUrl = files?.avatarUrl?.[0]
      ? await uploadToCloudinary(files.avatarUrl[0], 'circle-avatars', 'avatar')
      : null;

    const bannerUrl = files?.bannerUrl?.[0]
      ? await uploadToCloudinary(files.bannerUrl[0], 'circle-banners', 'banner')
      : null;

    const updatedUser = await profileService.updateProfile(userId, {
      ...validDataWithoutAvatar,
      avatarUrl,
      bannerUrl,
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
