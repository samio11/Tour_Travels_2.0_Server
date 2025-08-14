import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { bookingServices } from "./booking.service";
import { sendResponse } from "../../utils/sendResponse";

const createBooking = catchAsync(async (req, res, next) => {
  const decodedToken = req.user as JwtPayload;
  const { userId } = decodedToken;
  const userData = req.body;
  const result = await bookingServices.createBooking(userData, userId);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Booking Created",
    data: result,
  });
});
const getAllBooking = catchAsync(async (req, res, next) => {
  const query = req?.query;
  const result = await bookingServices.getAllBooking(
    query as Record<string, string>
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Getting All Booked Tour",
    data: result,
  });
});
const getABooking = catchAsync(async (req, res, next) => {
  const { userId } = req.user as JwtPayload;
  const result = await bookingServices.getPersonsBooking(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Getting Your Booked Tour",
    data: result,
  });
});
const deleteBooking = catchAsync(async (req, res, next) => {
  const { bookingId } = req.params;
  const { userId } = req.user as JwtPayload;
  await bookingServices.deleteBooking(bookingId, userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking is Deleted",
    data: null,
  });
});

export const bookingController = {
  createBooking,
  getAllBooking,
  getABooking,
  deleteBooking,
};
