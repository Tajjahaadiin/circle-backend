import express, { NextFunction, Request, Response } from 'express';
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('wellcome to circle API');
});

router.post('/', (req: Request, res: Response, neext: NextFunction) => {
  const { fullName, userName, email, address } = req.body;
  res.json({ fullName, userName, email });
});
router.patch('/', (req: Request, res: Response) => {
  res.send('Welcome to PATCH');
});

router.delete('/', (req: Request, res: Response) => {
  res.send('Welcome to Delete');
});

export default router;
