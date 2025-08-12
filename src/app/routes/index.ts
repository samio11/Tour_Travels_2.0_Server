import { Router } from "express";
import { otpRoutes } from "../modules/otp/otp.routes";

export const rootRouter = Router();

const moduleRoutes = [
  {
    path: "/otp",
    element: otpRoutes,
  },
];

moduleRoutes.forEach((x) => rootRouter.use(x.path, x.element));
