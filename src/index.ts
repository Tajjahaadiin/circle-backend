import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = process.env.PORT;
app.get("/", (req: Request, res: Response) => {
  res.send("hello world 🎨");
});
app.listen(port, () => {
  console.log(`app working in this ${port}`);
});
