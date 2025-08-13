"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootRouter = void 0;
const express_1 = require("express");
const otp_routes_1 = require("../modules/otp/otp.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
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
];
moduleRoutes.forEach((x) => exports.rootRouter.use(x.path, x.element));
