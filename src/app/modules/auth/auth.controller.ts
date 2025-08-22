import passport from "passport";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../errors/AppError";
import { createUserToken } from "../../utils/userToken";
import { setCookies } from "../../utils/setCookies";
import { sendResponse } from "../../utils/sendResponse";
import config from "../../config";
import { authServices } from "./auth.service";
import { JwtPayload } from "jsonwebtoken";

const credentialLogin = catchAsync(async (req, res, next) => {
  passport.authenticate("local", async (err: any, user: any, info: any) => {
    if (err) {
      return next(new AppError(401, err));
    }
    if (!user) {
      return next(new AppError(401, info.message));
    }
    const token = await createUserToken(user);

    const { password: pass, ...rest } = user.toObject();

    await setCookies(res, token);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login Done!!",
      data: {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        user: rest,
      },
    });
  })(req, res, next);
});

const logout = catchAsync(async (req, res, next) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logout Done",
    data: "",
  });
});

const googleLogin = catchAsync(async (req, res, next) => {
  const user = req.user;
  //   console.log(user);
  if (!user) {
    throw new AppError(401, "User not found");
  }
  const token = await createUserToken(user);
  await setCookies(res, token);
  res.redirect(`${config.FRONTEND_URL}`);
});

const getNewAccessToken = catchAsync(async (req, res, next) => {
  // Get Cookie Value
  const refreshToken = req.cookies.refreshToken;
  const accessToken = await authServices.getNewAccessToken(refreshToken);
  //   console.log(refreshToken);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "AccessToken Given!!!",
    data: accessToken,
  });
});
const changePassword = catchAsync(async (req, res, next) => {
  // Get Cookie Value
  const decodedToken = req.user as JwtPayload;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const updatedPassword = await authServices.changePassword(
    oldPassword,
    newPassword,
    decodedToken
  );
  //   console.log(refreshToken);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password Changed!!!",
    data: "",
  });
});

export const authController = {
  credentialLogin,
  logout,
  googleLogin,
  getNewAccessToken,
  changePassword,
};
