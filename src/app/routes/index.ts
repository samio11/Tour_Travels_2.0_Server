import { Router } from "express";
import { otpRoutes } from "../modules/otp/otp.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { userRouter } from "../modules/user/user.routes";
import { divisionRoutes } from "../modules/division/division.routes";
import { tourRoutes } from "../modules/tour/tour.routes";
import { bookingRoutes } from "../modules/booking/booking.route";
import { paymentRoute } from "../modules/payment/payment.routes";

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
  {
    path: "/tour",
    element: tourRoutes,
  },
  {
    path: "/booking",
    element: bookingRoutes,
  },
  {
    path: "/payment",
    element: paymentRoute,
  },
];

moduleRoutes.forEach((x) => rootRouter.use(x.path, x.element));
