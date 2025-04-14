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
              },
              update: {
                fullName: data.fullName,
                bio: data.bio,
                avatarUrl: data.avatarUrl,
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
}

export default new ProfileService();
