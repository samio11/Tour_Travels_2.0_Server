import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userServices } from "./user.service";

const createUser = catchAsync(async (req, res, next) => {
  const userData = req.body;
  const result = await userServices.createUser(userData);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "User Created Done",
    data: result,
  });
});
const getMe = catchAsync(async (req, res, next) => {
  const decodedToken = req.user as JwtPayload;

  const result = await userServices.getMe(decodedToken);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User Data Found!!!",
    data: result,
  });
});
const getAllUser = catchAsync(async (req, res, next) => {
  const query = req.query;
  //   console.log(query);
  const result = await userServices.getAllUser(query as Record<string, string>);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All User Data Retrived!!!",
    data: result,
  });
});

export const userController = { createUser, getMe, getAllUser };
