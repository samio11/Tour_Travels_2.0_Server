import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { tourServices } from "./tour.services";

const createTourType = catchAsync(async (req, res, next) => {
  const payload = req.body;
  const result = await tourServices.createTourType(payload);
  sendResponse(res, {
    statusCode: 201,
    message: "Tour Type Created Successful",
    success: true,
    data: result,
  });
});
const createTour = catchAsync(async (req, res, next) => {
  const payload = {
    ...JSON.parse(req.body.data),
    images: (req.files as Express.Multer.File[]).map((x) => x.path),
  };
  const result = await tourServices.createTour(payload);
  sendResponse(res, {
    statusCode: 201,
    message: "Tour Created Successful",
    success: true,
    data: result,
  });
});
const getAllTourType = catchAsync(async (req, res, next) => {
  const query = req?.query;
  const result = await tourServices.getAllTourType(
    query as Record<string, string>
  );
  sendResponse(res, {
    statusCode: 200,
    message: "All Tour Type Retrived",
    success: true,
    data: result,
  });
});
const getAllTour = catchAsync(async (req, res, next) => {
  const query = req?.query;
  const result = await tourServices.getAllTour(query as Record<string, string>);
  sendResponse(res, {
    statusCode: 200,
    message: "All Tour Retrived",
    success: true,
    data: result,
  });
});
const getATourType = catchAsync(async (req, res, next) => {
  const { id } = req?.params;
  const result = await tourServices.getATourType(id);
  sendResponse(res, {
    statusCode: 200,
    message: "A Tour Type Retrived",
    success: true,
    data: result,
  });
});
const getATour = catchAsync(async (req, res, next) => {
  const { slug } = req?.params;
  const result = await tourServices.getATour(slug);
  sendResponse(res, {
    statusCode: 200,
    message: "A Tour Retrived",
    success: true,
    data: result,
  });
});
const deleteATourType = catchAsync(async (req, res, next) => {
  const { id } = req?.params;
  const result = await tourServices.deleteATourType(id);
  sendResponse(res, {
    statusCode: 200,
    message: "A Tour Type Deleted",
    success: true,
    data: result,
  });
});

export const tourControllers = {
  createTourType,
  getAllTourType,
  getATourType,
  createTour,
  getAllTour,
  getATour,
  deleteATourType,
};
