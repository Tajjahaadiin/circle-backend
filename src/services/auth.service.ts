import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RegisterDTO } from '../dtos/auth.dtos';
import { prisma } from '../lib/prisma';

interface LoginResult {
  user: User;
  token: string;
}
async function login(
  logindata: string,
  password: string,
): Promise<LoginResult> {
  const user = await prisma.user.findUnique({
    where: !!logindata.includes('@')
      ? { email: logindata }
      : { username: logindata },
  });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error(`Invalid credentials `);
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || '', {
    expiresIn: '1h',
  });
  return { user, token };
}
async function register(data: RegisterDTO) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const registerdata: RegisterDTO = { ...data, password: hashedPassword };
  const { fullName, ...userData } = registerdata;

  const newUser = await prisma.user.create({
    data: {
      ...userData,
      profile: {
        create: { fullName },
      },
    },
  });
  return newUser;
}

async function resetPassword(email: string, hashedNewPassword: string) {
  return await prisma.user.update({
    where: { email },
    data: {
      password: hashedNewPassword,
    },
  });
}

export default { login, register, resetPassword };
