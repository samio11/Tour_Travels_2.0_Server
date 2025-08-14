import { Router } from "express";
import { paymentController } from "./payment.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post(
  "/init-payment/:bookingId",
  checkAuth(...Object.values(Role)),
  paymentController.initPayment
);
router.post("/success", paymentController.successPayment);
router.post("/fail", paymentController.failedPayment);
router.post("/cancel", paymentController.cancelPayment);

export const paymentRoute = router;
