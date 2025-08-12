import config from "../../config";
import { radisClient } from "../../config/radis.config";
import { AppError } from "../../errors/AppError";
import { sendEmail } from "../../utils/sendEmail";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";
import crypto from "crypto";

const OTP_EXPIRATION = 2 * 60;
const getOTP = (length = 6) => {
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
  return otp;
};

const sendOTP = async (email: string, name: string) => {
  try {
    const existUser = await User.findOne({ email });
    if (!existUser) {
      throw new AppError(401, "User Not Found");
    }
    const newOtp = getOTP();
    const redisKey = `otp:${email}`;
    await radisClient.set(redisKey, newOtp, {
      expiration: {
        type: "EX",
        value: OTP_EXPIRATION,
      },
    });
    await sendEmail({
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
  } catch (err: any) {
    throw new AppError(401, err);
  }
};

const verifyOTP = async (email: string, otp: string) => {
  try {
    const existUser = await User.findOne({ email });
    if (!existUser) {
      throw new AppError(401, "User Not Found");
    }
    if (
      existUser.isActive === IsActive.INACTIVE ||
      existUser.isActive === IsActive.BLOCKED
    ) {
      throw new AppError(401, `User is ${existUser.isActive}`);
    }
    if (existUser.isDeleted === true) {
      throw new AppError(401, "User is Deleted");
    }

    const radisKey = `otp:${email}`;
    const savedOTP = await radisClient.get(radisKey);
    if (savedOTP !== otp) {
      throw new AppError(401, "Invalid OTP");
    }

    const updatedAccount = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );
    if (updatedAccount) {
      await sendEmail({
        to: existUser.email,
        subject: "Account Verified",
        tempName: "verifiedAccount",
        tempData: {
          companyName: "Tour Travel 2.0",
          name: existUser.name,
          loginUrl: `${config.FRONTEND_URL}/login`,
        },
      });
      console.log(`User updated!!!`);
    }
  } catch (err: any) {
    throw new AppError(401, err);
  }
};

export const otpServices = { sendOTP, verifyOTP };
