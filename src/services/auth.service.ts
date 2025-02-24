import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();
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
async function register(userData: User) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = await prisma.user.create({
    data: { ...userData, password: hashedPassword },
  });
  return newUser;
}
export default { login, register };
