"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const passport_1 = __importDefault(require("passport"));
const catchAsync_1 = require("../../utils/catchAsync");
const AppError_1 = require("../../errors/AppError");
const userToken_1 = require("../../utils/userToken");
const setCookies_1 = require("../../utils/setCookies");
const sendResponse_1 = require("../../utils/sendResponse");
const config_1 = __importDefault(require("../../config"));
const auth_service_1 = require("./auth.service");
const credentialLogin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("local", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return next(new AppError_1.AppError(401, err));
        }
        if (!user) {
            return next(new AppError_1.AppError(401, info.message));
        }
        const token = yield (0, userToken_1.createUserToken)(user);
        const _a = user.toObject(), { password: pass } = _a, rest = __rest(_a, ["password"]);
        yield (0, setCookies_1.setCookies)(res, token);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: 200,
            success: true,
            message: "Login Done!!",
            data: {
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
                user: rest,
            },
        });
    }))(req, res, next);
}));
const logout = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Logout Done",
        data: "",
    });
}));
const googleLogin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    //   console.log(user);
    if (!user) {
        throw new AppError_1.AppError(401, "User not found");
    }
    const token = yield (0, userToken_1.createUserToken)(user);
    yield (0, setCookies_1.setCookies)(res, token);
    res.redirect(`${config_1.default.FRONTEND_URL}`);
}));
const getNewAccessToken = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get Cookie Value
    const refreshToken = req.cookies.refreshToken;
    const accessToken = yield auth_service_1.authServices.getNewAccessToken(refreshToken);
    //   console.log(refreshToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "AccessToken Given!!!",
        data: accessToken,
    });
}));
const changePassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get Cookie Value
    const decodedToken = req.user;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const updatedPassword = yield auth_service_1.authServices.changePassword(oldPassword, newPassword, decodedToken);
    //   console.log(refreshToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Password Changed!!!",
        data: "",
    });
}));
exports.authController = {
    credentialLogin,
    logout,
    googleLogin,
    getNewAccessToken,
    changePassword,
};
