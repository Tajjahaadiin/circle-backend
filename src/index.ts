import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from '../swagger/swagger-output.json';
import swaggerConfig from './lib/swagger-styles';
import authRouter from './routes/auth.routes';
import indexRouter from './routes/index.routes';
import threadRouter from './routes/thread.routes';
import userRouter from './routes/user.routes';
import likeRouter from './routes/like.routes';
import replyRouter from './routes/reply.routes';
import followRouter from './routes/follow.routes';
import profileRouter from './routes/profile.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ['https://foundation-circle.vercel.app'] }));

const port = process.env.PORT;
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, swaggerConfig));
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/threads', threadRouter);
app.use('/likes', likeRouter);
app.use('/replies', replyRouter);
app.use('/follows', followRouter);
app.use('/profile', profileRouter);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`app working in this ${port}`);
});
