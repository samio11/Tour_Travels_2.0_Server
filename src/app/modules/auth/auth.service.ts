import { JwtPayload } from "jsonwebtoken";
import { getAccessTokenByRefreshToken } from "../../utils/userToken";
import { User } from "../user/user.model";
import { AppError } from "../../errors/AppError";
import bcrypt from "bcrypt";
import config from "../../config";

const getNewAccessToken = async (refreshToken: string) => {
  const accessToken = await getAccessTokenByRefreshToken(refreshToken);
  return {
    accessToken,
  };
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  try {
    const existUser = await User.findById(decodedToken.userId);
    if (!existUser) {
      throw new AppError(401, "User not found!!");
    }
    const oldPasswordMatch = await bcrypt.compare(
      oldPassword,
      existUser.password as string
    );
    if (!oldPasswordMatch) {
      throw new AppError(401, "Wrong Password");
    }
    const hashPassword = await bcrypt.hash(
      newPassword,
      Number(config.BCRYPT_SALT)
    );
    const updatedPassword = await User.findOneAndUpdate(
      { email: existUser.email },
      { password: hashPassword },
      { new: true }
    ).select("password");
    return updatedPassword;
  } catch (err: any) {
    throw new AppError(401, err);
  }
};

export const authServices = { getNewAccessToken, changePassword };
