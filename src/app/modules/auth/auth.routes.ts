import { NextFunction, Request, Response, Router } from "express";
import { authController } from "./auth.controller";
import passport from "passport";
import config from "../../config";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post("/login", authController.credentialLogin);
router.post("/logout", authController.logout);
router.post("/get-access-token", authController.getNewAccessToken);
router.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  authController.changePassword
);

// Google
router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirectTo = req?.query?.redirectTo || "";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirectTo as string,
    })(req, res, next);
  }
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${config.FRONTEND_URL}/login`,
    session: false,
  }),
  authController.googleLogin
);

export const authRoutes = router;
