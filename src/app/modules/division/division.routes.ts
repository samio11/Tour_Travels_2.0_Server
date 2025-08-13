import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { multerUpload } from "../../config/multer.config";
import { divisionController } from "./division.controller";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  multerUpload.single("file"),
  divisionController.createDivision
);
router.get("/get-division", divisionController.getAllDivision);
router.get("/get-a-division/:slug", divisionController.getADivision);

export const divisionRoutes = router;
