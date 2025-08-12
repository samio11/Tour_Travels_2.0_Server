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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessTokenByRefreshToken = exports.createUserToken = void 0;
const config_1 = __importDefault(require("../config"));
const user_interface_1 = require("../modules/user/user.interface");
const jwt_1 = require("./jwt");
const user_model_1 = require("../modules/user/user.model");
const AppError_1 = require("../errors/AppError");
const createUserToken = (userInfo) => {
    const payload = {
        userId: userInfo._id,
        email: userInfo.email,
        role: userInfo.role,
    };
    const accessToken = (0, jwt_1.generateToken)(payload, config_1.default.JWT_ACCESS_TOKEN, config_1.default.JWT_ACCESS_EXPIRES);
    const refreshToken = (0, jwt_1.generateToken)(payload, config_1.default.JWT_REFRESH_TOKEN, config_1.default.JWT_REFRESH_EXPIRES);
    return {
        accessToken,
        refreshToken,
    };
};
exports.createUserToken = createUserToken;
const getAccessTokenByRefreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyRefreshToken = (0, jwt_1.verifyToken)(token, config_1.default.JWT_REFRESH_TOKEN);
    const existUser = yield user_model_1.User.findOne({ email: verifyRefreshToken.email });
    if (!existUser) {
        throw new AppError_1.AppError(401, "User Not Found");
    }
    if (existUser.isVerified === false) {
        throw new AppError_1.AppError(401, "User is UnVerified");
    }
    if (existUser.isActive === user_interface_1.IsActive.INACTIVE ||
        existUser.isActive === user_interface_1.IsActive.BLOCKED) {
        throw new AppError_1.AppError(401, `User is ${existUser.isActive}`);
    }
    if (existUser.isDeleted === true) {
        throw new AppError_1.AppError(401, "User is Deleted");
    }
    const payload = {
        userId: existUser._id,
        email: existUser.email,
        role: existUser.role,
    };
    const accessToken = (0, jwt_1.generateToken)(payload, config_1.default.JWT_ACCESS_TOKEN, config_1.default.JWT_ACCESS_EXPIRES);
    return accessToken;
});
exports.getAccessTokenByRefreshToken = getAccessTokenByRefreshToken;
