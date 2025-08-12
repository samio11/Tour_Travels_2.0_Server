import { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import { AppError } from "../errors/AppError";

export const createUserToken = (userInfo: Partial<IUser>) => {
  const payload = {
    userId: userInfo._id,
    email: userInfo.email,
    role: userInfo.role,
  };
  const accessToken = generateToken(
    payload,
    config.JWT_ACCESS_TOKEN as string,
    config.JWT_ACCESS_EXPIRES as string
  );
  const refreshToken = generateToken(
    payload,
    config.JWT_REFRESH_TOKEN as string,
    config.JWT_REFRESH_EXPIRES as string
  );
  return {
    accessToken,
    refreshToken,
  };
};

export const getAccessTokenByRefreshToken = async (token: string) => {
  const verifyRefreshToken = verifyToken(
    token,
    config.JWT_REFRESH_TOKEN as string
  ) as JwtPayload;
  const existUser = await User.findOne({ email: verifyRefreshToken.email });
  if (!existUser) {
    throw new AppError(401, "User Not Found");
  }
  if (existUser.isVerified === false) {
    throw new AppError(401, "User is UnVerified");
  }
  if (
    existUser.isActive === IsActive.INACTIVE ||
    existUser.isActive === IsActive.BLOCKED
  ) {
    throw new AppError(401, `User is ${existUser.isActive}`);
  }
  if (existUser.isDeleted === true) {
    throw new AppError(401, "User is Deleted");
  }
  const payload = {
    userId: existUser._id,
    email: existUser.email,
    role: existUser.role,
  };
  const accessToken = generateToken(
    payload,
    config.JWT_ACCESS_TOKEN as string,
    config.JWT_ACCESS_EXPIRES as string
  );
  return accessToken;
};
