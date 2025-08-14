"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootRouter = void 0;
const express_1 = require("express");
const otp_routes_1 = require("../modules/otp/otp.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const user_routes_1 = require("../modules/user/user.routes");
const division_routes_1 = require("../modules/division/division.routes");
const tour_routes_1 = require("../modules/tour/tour.routes");
const booking_route_1 = require("../modules/booking/booking.route");
const payment_routes_1 = require("../modules/payment/payment.routes");
exports.rootRouter = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/otp",
        element: otp_routes_1.otpRoutes,
    },
    {
        path: "/auth",
        element: auth_routes_1.authRoutes,
    },
    {
        path: "/user",
        element: user_routes_1.userRouter,
    },
    {
        path: "/division",
        element: division_routes_1.divisionRoutes,
    },
    {
        path: "/tour",
        element: tour_routes_1.tourRoutes,
    },
    {
        path: "/booking",
        element: booking_route_1.bookingRoutes,
    },
    {
        path: "/payment",
        element: payment_routes_1.paymentRoute,
    },
];
moduleRoutes.forEach((x) => exports.rootRouter.use(x.path, x.element));
