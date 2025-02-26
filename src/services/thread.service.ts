import { CreateThreadDTO } from '../dtos/thread.dto';
import { prisma } from '../lib/prisma';

export async function onGetThreads() {
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

export async function onGetThreadById(id: string) {
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
export async function onCreateThread(userId: string, data: CreateThreadDTO) {
  const { content, images } = data;
  return await prisma.thread.create({
    data: {
      images,
      content,
      userId,
    },
  });
}
