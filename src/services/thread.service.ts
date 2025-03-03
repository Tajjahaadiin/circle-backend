import { CreateThreadDTO } from '../dtos/thread.dto';
import { prisma } from '../lib/prisma';
import { BadRequestError } from '../utils/errors';
export async function onGetThreads(userId: string) {
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
