import express, { Application, Request, Response } from "express";
import cors from "cors";
import "./app/config/passport";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import { rootRouter } from "./app/routes";
import config from "./app/config";
const app: Application = express();
app.use(
  cors({
    origin: config.FRONTEND_URL as string, // e.g. "http://localhost:5173"
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", rootRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running successfully" });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
