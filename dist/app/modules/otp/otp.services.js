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
exports.otpServices = void 0;
const config_1 = __importDefault(require("../../config"));
const radis_config_1 = require("../../config/radis.config");
const AppError_1 = require("../../errors/AppError");
const sendEmail_1 = require("../../utils/sendEmail");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const crypto_1 = __importDefault(require("crypto"));
const OTP_EXPIRATION = 2 * 60;
const getOTP = (length = 6) => {
    const otp = crypto_1.default.randomInt(10 ** (length - 1), 10 ** length).toString();
    return otp;
};
const sendOTP = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existUser = yield user_model_1.User.findOne({ email });
        if (!existUser) {
            throw new AppError_1.AppError(401, "User Not Found");
        }
        const newOtp = getOTP();
        const redisKey = `otp:${email}`;
        yield radis_config_1.radisClient.set(redisKey, newOtp, {
            expiration: {
                type: "EX",
                value: OTP_EXPIRATION,
            },
        });
        yield (0, sendEmail_1.sendEmail)({
            to: existUser.email,
            subject: "Verification OTP",
            tempName: "verificationOTP",
            tempData: {
                companyName: "Tour Travel 2.0",
                name: existUser.name,
                otp: newOtp,
                otpExpiryMinutes: Number(OTP_EXPIRATION / 60),
            },
        });
    }
    catch (err) {
        throw new AppError_1.AppError(401, err);
    }
});
const verifyOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existUser = yield user_model_1.User.findOne({ email });
        if (!existUser) {
            throw new AppError_1.AppError(401, "User Not Found");
        }
        if (existUser.isActive === user_interface_1.IsActive.INACTIVE ||
            existUser.isActive === user_interface_1.IsActive.BLOCKED) {
            throw new AppError_1.AppError(401, `User is ${existUser.isActive}`);
        }
        if (existUser.isDeleted === true) {
            throw new AppError_1.AppError(401, "User is Deleted");
        }
        const radisKey = `otp:${email}`;
        const savedOTP = yield radis_config_1.radisClient.get(radisKey);
        if (savedOTP !== otp) {
            throw new AppError_1.AppError(401, "Invalid OTP");
        }
        const updatedAccount = yield user_model_1.User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });
        if (updatedAccount) {
            yield (0, sendEmail_1.sendEmail)({
                to: existUser.email,
                subject: "Account Verified",
                tempName: "verifiedAccount",
                tempData: {
                    companyName: "Tour Travel 2.0",
                    name: existUser.name,
                    loginUrl: `${config_1.default.FRONTEND_URL}/login`,
                },
            });
            console.log(`User updated!!!`);
        }
    }
    catch (err) {
        throw new AppError_1.AppError(401, err);
    }
});
exports.otpServices = { sendOTP, verifyOTP };
