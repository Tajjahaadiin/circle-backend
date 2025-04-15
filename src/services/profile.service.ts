import { PrismaClient } from '@prisma/client';
import { UpdateProfileDTO } from '../dtos/user.dto';

const prisma = new PrismaClient();

class ProfileService {
  async updateProfile(userId: string, data: UpdateProfileDTO) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          username: data.username,
          profile: {
            upsert: {
              create: {
                fullName: data.fullName,
                bio: data.bio,
                avatarUrl: data.avatarUrl,
                bannerUrl: data.bannerUrl,
              },
              update: {
                fullName: data.fullName,
                bio: data.bio,
                avatarUrl: data.avatarUrl,
                bannerUrl: data.bannerUrl,
              },
            },
          },
        },
        include: {
          profile: true, // Include the updated profile in the response
        },
      });

      return user;
    } catch (error) {
      console.error('Error updating profile in service:', error);
      throw error;
    }
  }
  async getProfileById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          profile: { select: { avatarUrl: true, bannerUrl: true } },
        },
      });
      return user;
    } catch (errror) {
      console.error('Error get user By Id:', errror);
      throw new Error('Failed to get users by Id');
    }
  }
}
export default new ProfileService();
