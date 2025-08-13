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
exports.authServices = void 0;
const userToken_1 = require("../../utils/userToken");
const user_model_1 = require("../user/user.model");
const AppError_1 = require("../../errors/AppError");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield (0, userToken_1.getAccessTokenByRefreshToken)(refreshToken);
    return {
        accessToken,
    };
});
const changePassword = (oldPassword, newPassword, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existUser = yield user_model_1.User.findById(decodedToken.userId);
        if (!existUser) {
            throw new AppError_1.AppError(401, "User not found!!");
        }
        const oldPasswordMatch = yield bcrypt_1.default.compare(oldPassword, existUser.password);
        if (!oldPasswordMatch) {
            throw new AppError_1.AppError(401, "Wrong Password");
        }
        const hashPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.BCRYPT_SALT));
        const updatedPassword = yield user_model_1.User.findOneAndUpdate({ email: existUser.email }, { password: hashPassword }, { new: true }).select("password");
        return updatedPassword;
    }
    catch (err) {
        throw new AppError_1.AppError(401, err);
    }
});
exports.authServices = { getNewAccessToken, changePassword };
