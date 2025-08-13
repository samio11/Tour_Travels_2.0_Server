import config from "../../config";
import { IAuthProvider, IUser } from "./user.interface";
import bcrypt from "bcrypt";
import { User } from "./user.model";
import { AppError } from "../../errors/AppError";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/QueryBuilder";

const createUser = async (payload: Partial<IUser>) => {
  const existUser = await User.findOne({ email: payload.email });
  if (existUser) {
    throw new AppError(401, "User is already exists");
  }

  const hashPassword = await bcrypt.hash(
    payload.password as string,
    Number(config.BCRYPT_SALT)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: payload.email as string,
  };
  const userPayload = {
    ...payload,
    password: hashPassword,
    auths: [authProvider],
  };
  const newUser = await User.create(userPayload);
  return newUser;
};

const getMe = async (decodedToken: JwtPayload) => {
  //   console.log(decodedToken);
  const existUser = await User.findOne({ email: decodedToken.email as string });
  console.log(existUser);
  if (!existUser) {
    throw new AppError(401, "user is not Exists");
  }
  return existUser;
};

const getAllUser = async (query: Record<string, string>) => {
  console.log("In Get all user", query);
  const queryBuilder = new QueryBuilder(User.find(), query)
    .filter()
    .search(["name"])
    .sort()
    .paginate()
    .fields();
  const result = await queryBuilder.build();
  console.log(result);
  return result;
};

export const userServices = { createUser, getMe, getAllUser };
