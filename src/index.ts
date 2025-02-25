import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import indexRouter from './routes/index.routes';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import threadRouter from './routes/thread.routes';

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT;
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/threads', threadRouter);
app.listen(port, () => {
  console.log(`app working in this ${port}`);
});
