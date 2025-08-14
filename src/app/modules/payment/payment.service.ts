import { AppError } from "../../errors/AppError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";

const initPayment = async (bookingId: string, userId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });
  if (!payment) {
    throw new AppError(401, "No Payment for this booking is avalible");
  }

  const foundBooking = await Booking.findById(bookingId);

  if (userId !== foundBooking?.user.toString()) {
    throw new AppError(401, "This Payment is not for this user");
  }

  const name = (foundBooking?.user as any).name;
  const email = (foundBooking?.user as any).email;

  const sslCommerz: ISSLCommerz = {
    amount: payment.amount,
    transactionId: payment.transactionId,
    name: name,
    email: email,
    phoneNumber: "01709801305",
    address: "Nikunja-02,Dhaka",
  };

  const sslPayment = await SSLService.sslPaymentInit(sslCommerz);

  return {
    paymentUrl: sslPayment.GatewayPageURL,
  };
};

const successPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatePayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.PAID },
      { new: true, session }
    );

    await Booking.findOneAndUpdate(
      { payment: updatePayment?._id },
      { status: BOOKING_STATUS.COMPLETE },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();
    return { success: true, message: `Payment Completed` };
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
const failedPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatePayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.FAILED },
      { new: true, session }
    );

    await Booking.findOneAndUpdate(
      { payment: updatePayment?._id },
      { status: BOOKING_STATUS.FAIL },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();
    return { success: false, message: `Payment Failed` };
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
const cancelPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatePayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.CANCELLED },
      { new: true, session }
    );

    await Booking.findOneAndUpdate(
      { payment: updatePayment?._id },
      { status: BOOKING_STATUS.CANCEL },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();
    return { success: false, message: `Payment Canceled` };
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export const paymentServices = {
  initPayment,
  successPayment,
  failedPayment,
  cancelPayment,
};
