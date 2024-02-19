import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { config } from "./config";
import authRoutes from "./routes/authRoutes";
import boardRoutes from "./routes/boardRoutes";

dotenv.config();

const app = express();
const port = config.port;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/auth", authRoutes);
app.use("/boards", boardRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("안녕하세요~");
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(` ${port} 서버가 작동하고 있어요`);
});
