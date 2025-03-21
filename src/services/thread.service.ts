import {
  CreateThreadDTO,
  PaginationDTO,
  UpdateThreadDTO,
} from '../dtos/thread.dto';
import { prisma } from '../lib/prisma';
import { BadRequestError, NotFoundError } from '../utils/errors';

export async function onGetThreads(userId: string, pagination?: PaginationDTO) {
  const { limit, startIndex } = pagination || {};
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
      likes: {
        where: { userId },
        select: { id: true },
      },
      _count: {
        select: { likes: true },
      },
    },
    take: limit,
    skip: startIndex,
    orderBy: {
      createdAt: 'desc',
    },
  });
}

///onGetThreadsPossible update
// export async function onGetThreads(page: number = 1, limit: number = 10) {
//   const skip = (page - 1) * limit; // Calculate how many records to skip
//   const take = limit;             // Number of records to take per page

//   const threads = await prisma.thread.findMany({
//       skip,
//       take,
//       include: { /* ... your existing include ... */ },
//       orderBy: { createdAt: 'desc' },
//   });

//   const totalCount = await prisma.thread.count(); // Get total number of threads for pagination metadata
//   const totalPages = Math.ceil(totalCount / limit);
//   const currentPage = page;

//   return {
//       threads,
//       pagination: {
//           totalCount,
//           totalPages,
//           currentPage,
//           limit
//       }
//   };
// }

export async function onGetThreadById(id: string) {
  return await prisma.thread.findUnique({
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
export async function getDeleteThread(id: string) {
  return await prisma.thread.findUnique({
    where: { id },
    select: { id: true, images: true },
  });
}
export async function onCreateThread(userId: string, data: CreateThreadDTO) {
  const { content, images } = data;
  if (!userId) {
    throw new BadRequestError('User ID is required to create a thread.');
  }
  if (!content || content.trim() === '') {
    throw new BadRequestError('Thread content cannot be empty.');
  }
  return await prisma.thread.create({
    data: {
      images,
      content,
      userId,
    },
  });
}
export async function onUpdateThread(id: string, data: UpdateThreadDTO) {
  const { content, images } = data;
  if (!id) {
    throw new BadRequestError('thread not found.');
  }
  if (!content || content.trim() === '') {
    throw new BadRequestError('Thread content cannot be empty.');
  }
  return await prisma.thread.update({
    where: {
      id,
    },
    data: {
      images,
      content,
    },
  });
}
export async function onDeleteThreadById(id: string) {
  try {
    const thread = await prisma.thread.delete({ where: { id } });
    return thread;
  } catch (error: any) {
    console.error(`Error deleting thread ${error}`);
    throw new Error(`failed to delete thread: ${error?.message} `);
  }
}
