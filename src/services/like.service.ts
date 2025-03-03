import { userCreateDTO, UpdateUserDTO } from '../dtos/user.dto';
import { prisma } from '../lib/prisma';

class LikeService {
  async getLikeById(userId: string, threadId: string) {
    return await prisma.like.findFirst({
      where: {
        userId,
        threadId,
      },
    });
  }

  async createLike(userId: string, threadId: string) {
    return await prisma.like.create({
      data: {
        userId,
        threadId,
      },
    });
  }

  async deleteLike(userId: string, threadId: string) {
    return await prisma.like.delete({
      where: { unique_user_thread_like: { userId, threadId } },
    });
  }
}

export default new LikeService();
