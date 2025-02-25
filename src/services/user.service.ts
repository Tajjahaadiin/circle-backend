import { CreateUserDTO, UpdateUserDTO } from '../dtos/user.dto';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';

async function getUsers() {
  return await prisma.user.findMany();
}
async function getUserById(id: string) {
  return await prisma.user.findFirst({
    where: { id },
    include: {
      profile: true,
    },
  });
}

async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      profile: true,
    },
  });
}

async function createUser(data: CreateUserDTO) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const datatoCreate: CreateUserDTO = { ...data, password: hashedPassword };
  const { fullName, ...userData } = datatoCreate;
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
async function deleteUserByid(id: string) {
  console.log('masuk delete', id);
  return await prisma.user.delete({
    where: { id },
  });
}
async function updateUserById(id: string, data: UpdateUserDTO) {
  const { email, username } = data;
  return await prisma.user.update({
    where: { id },
    data: {
      email,
      username,
    },
  });
}
export default {
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUserById,
  deleteUserByid,
};
