import { AppError } from "../../errors/AppError";
import { IBooking } from "./booking.interface";
import { Booking } from "./booking.model";

const createBooking = async (payload: IBooking) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    // Last Part
    await session.commitTransaction();
    session.endSession();
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(401, err);
  }
};

export const bookingServices = { createBooking };
