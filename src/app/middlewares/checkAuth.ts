import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { verifyToken } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req?.headers?.authorization || req.cookies.accessToken;
      if (!token) {
        throw new AppError(401, "Token is not found");
      }
      const verifiedToken = verifyToken(
        token,
        config.JWT_ACCESS_TOKEN as string
      ) as JwtPayload;
      const existUser = await User.findOne({ email: verifiedToken.email });
      //   console.log(existUser);
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
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(401, "Access Denied,You are not permitted");
      }

      req.user = verifiedToken;
      //   console.log(req.user);
      next();
    } catch (err) {
      next(err);
    }
  };
