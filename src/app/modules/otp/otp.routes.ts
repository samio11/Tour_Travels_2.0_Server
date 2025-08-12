import { Router } from "express";
import { otpController } from "./otp.controller";

const router = Router();

router.post("/send-otp", otpController.sendOtp);
router.post("/verify-otp", otpController.verifyOTP);

export const otpRoutes = router;
