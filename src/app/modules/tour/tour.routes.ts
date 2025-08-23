import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { tourControllers } from "./tour.controller";
import { multerUpload } from "../../config/multer.config";

const router = Router();
// Tour Type
router.post(
  "/create-tour-type",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  tourControllers.createTourType
);
router.post(
  "/create-tour",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  multerUpload.array("files"),
  tourControllers.createTour
);
router.delete(
  "/delete-tour-type/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  tourControllers.deleteATourType
);

router.get("/get-all-tour-type", tourControllers.getAllTourType);
router.get("/get-all-tour", tourControllers.getAllTour);
router.get("/get-a-tour-type/:id", tourControllers.getATourType);
router.get("/get-a-tour/:slug", tourControllers.getATour);

export const tourRoutes = router;
