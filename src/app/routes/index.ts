import { Router } from "express";
import { otpRoutes } from "../modules/otp/otp.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { userRouter } from "../modules/user/user.routes";

export const rootRouter = Router();

const moduleRoutes = [
  {
    path: "/otp",
    element: otpRoutes,
  },
  {
    path: "/auth",
    element: authRoutes,
  },
  {
    path: "/user",
    element: userRouter,
  },
];

moduleRoutes.forEach((x) => rootRouter.use(x.path, x.element));
