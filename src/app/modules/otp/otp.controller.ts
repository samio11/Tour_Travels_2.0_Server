import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { otpServices } from "./otp.services";

const sendOtp = catchAsync(async (req, res, next) => {
  const { email, name } = req.body;
  await otpServices.sendOTP(email, name);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP Send Successful",
    data: "",
  });
});
const verifyOTP = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;
  await otpServices.verifyOTP(email, otp);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP verified Successful",
    data: "",
  });
});

export const otpController = { sendOtp, verifyOTP };
