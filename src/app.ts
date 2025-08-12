import express, { Application, Request, Response } from "express";
import cors from "cors";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import { rootRouter } from "./app/routes";
const app: Application = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", rootRouter);
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running successfully" });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
