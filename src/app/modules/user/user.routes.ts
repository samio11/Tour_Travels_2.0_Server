import { Router } from "express";
import { userController } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post("/create", userController.createUser);
router.get("/get-me", checkAuth(...Object.values(Role)), userController.getMe);
router.get(
  "/all-user",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  userController.getAllUser
);

export const userRouter = router;
