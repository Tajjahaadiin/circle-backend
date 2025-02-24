import { CreateUserDTO, UpdateUserDTO } from '../dtos/user.dto';
import { prisma } from '../lib/prisma';

export async function getUsers() {
  return await prisma.user.findMany();
}
export async function getUserByid(id: string) {
  return await prisma.user.findFirst({
    where: { id },
    include: {
      profile: true,
    },
  });
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      profile: true,
    },
  });
}

export async function createUser(data: CreateUserDTO) {
  const { fullName, ...userData } = data;
  return await prisma.user.create({
    data: {
      ...userData,
      profile: {
        create: {
          fullName,
        },
      },
    },
  });
}
export async function deleteUserByid(id: string) {
  return await prisma.user.delete({
    where: { id },
  });
}
export async function updateUserById(id: string, data: UpdateUserDTO) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}
