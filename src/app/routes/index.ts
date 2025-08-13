import { Router } from "express";
import { otpRoutes } from "../modules/otp/otp.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { userRouter } from "../modules/user/user.routes";
import { divisionRoutes } from "../modules/division/division.routes";

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
  {
    path: "/division",
    element: divisionRoutes,
  },
];

moduleRoutes.forEach((x) => rootRouter.use(x.path, x.element));
