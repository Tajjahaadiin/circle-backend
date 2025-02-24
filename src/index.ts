import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { testingMiddleware } from './middleware/test.middleware';

dotenv.config();
const app = express();
app.use(express.json());
enum RequestMethod {
  Get = 'GET',
  Delete = 'DELETE',
  Post = 'POST',
  Patch = 'PATCH',
}

const port = process.env.PORT;
app.get('/', (req: Request, res: Response) => {
  res.send('Get Request 🎨');
});
app.post(
  '/',
  testingMiddleware(RequestMethod.Post),
  (req: Request, res: Response) => {
    const body = req.body;
    res.json(body);
  },
);
app.patch('/', (req: Request, res: Response) => {
  res.send('patch Request 🎈');
});
app.delete('/', (req: Request, res: Response) => {
  res.send('delete Request 🎃');
});
app.listen(port, () => {
  console.log(`app working in this ${port}`);
});
