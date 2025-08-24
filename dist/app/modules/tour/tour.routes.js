"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tourRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const tour_controller_1 = require("./tour.controller");
const multer_config_1 = require("../../config/multer.config");
const router = (0, express_1.Router)();
// Tour Type
router.post("/create-tour-type", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SUPER_ADMIN, user_interface_1.Role.ADMIN), tour_controller_1.tourControllers.createTourType);
router.post("/create-tour", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SUPER_ADMIN, user_interface_1.Role.ADMIN), multer_config_1.multerUpload.array("files"), tour_controller_1.tourControllers.createTour);
router.delete("/delete-tour-type/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SUPER_ADMIN, user_interface_1.Role.ADMIN), tour_controller_1.tourControllers.deleteATourType);
router.delete("/delete-tour/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SUPER_ADMIN, user_interface_1.Role.ADMIN), tour_controller_1.tourControllers.deleteATour);
router.get("/get-all-tour-type", tour_controller_1.tourControllers.getAllTourType);
router.get("/get-all-tour", tour_controller_1.tourControllers.getAllTour);
router.get("/get-a-tour-type/:id", tour_controller_1.tourControllers.getATourType);
router.get("/get-a-tour/:slug", tour_controller_1.tourControllers.getATour);
exports.tourRoutes = router;
