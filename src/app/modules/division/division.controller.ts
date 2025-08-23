import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { divisionService } from "./division.service";

const createDivision = catchAsync(async (req, res, next) => {
  const divisionData = {
    ...JSON.parse(req.body.data),
    thumbnail: req.file?.path,
  };
  const result = await divisionService.createDivision(divisionData);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Division is created",
    data: result,
  });
});
const getAllDivision = catchAsync(async (req, res, next) => {
  const query = req.query;
  const result = await divisionService.getAllDivision(
    query as Record<string, string>
  );
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Division Retrived",
    data: result,
  });
});
const getADivision = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const result = await divisionService.getADivision(slug);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "A Division Retrived",
    data: result,
  });
});
const deleteDivision = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await divisionService.deleteDivision(id);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "A Division Deleted",
    data: "",
  });
});

export const divisionController = {
  createDivision,
  getAllDivision,
  getADivision,
  deleteDivision,
};
