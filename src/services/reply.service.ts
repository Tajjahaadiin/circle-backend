import { threadId } from 'worker_threads';
import { CreateReplyDTO } from '../dtos/reply.dto';
import { prisma } from '../lib/prisma';

export const getRepliesByThreadId = async (threadId: string) => {
  return await prisma.reply.findMany({
    where: { threadId },
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
};

export const createReply = async (
  userId: string,
  threadId: string,
  data: CreateReplyDTO,
) => {
  const { content } = data;
  return await prisma.reply.create({
    data: {
      threadId,
      content,
      userId,
    },
  });
};
