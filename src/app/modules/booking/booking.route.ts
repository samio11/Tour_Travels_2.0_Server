import { Router } from "express";
import { bookingController } from "./booking.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post(
  "/create",
  checkAuth(...Object.values(Role)),
  bookingController.createBooking
);
router.get(
  "/get-all-booking",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  bookingController.getAllBooking
);
router.get(
  "/get-a-booking",
  checkAuth(...Object.values(Role)),
  bookingController.getABooking
);

router.delete(
  "/delete-booking/:bookingId",
  checkAuth(...Object.values(Role)),
  bookingController.deleteBooking
);

export const bookingRoutes = router;
