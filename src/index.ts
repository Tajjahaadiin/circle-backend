import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from '../swagger/swagger-output.json';
import swaggerStyles from './lib/swaggerstyes';
import authRouter from './routes/auth.routes';
import indexRouter from './routes/index.routes';
import threadRouter from './routes/thread.routes';
import userRouter from './routes/user.routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ['http://localhost:5173'] }));

const port = process.env.PORT;
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, swaggerStyles));
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/threads', threadRouter);
app.listen(port, () => {
  console.log(`app working in this ${port}`);
});
