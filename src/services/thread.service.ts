import { CreateThreadDTO } from '../dtos/thread.dto';
import { prisma } from '../lib/prisma';

export async function getThreads() {
  return await prisma.thread.findMany({
    include: {
      user: {
        omit: {
          password: true,
        },
        include: {
          profile: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getThreadById(id: string) {
  return await prisma.thread.findFirst({
    where: { id },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
      replies: true,
    },
  });
}
export async function createThread(userId: string, data: CreateThreadDTO) {
  const { content, images } = data;
  return await prisma.thread.create({
    data: {
      images,
      content,
      userId,
    },
  });
}
