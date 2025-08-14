import { AppError } from "../../errors/AppError";
import { getTransictionId } from "../../utils/getTransictionId";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { sendEmail } from "../../utils/sendEmail";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { Tour } from "../tour/tour.model";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";

const createBooking = async (payload: IBooking, userId: string) => {
  const transectionId = getTransictionId();
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(userId);
    const tourCost = await Tour.findById(payload.tour).select("costFrom");
    if (!tourCost) {
      throw new AppError(401, "Tour is not found");
    }
    if (!tourCost?.costFrom) {
      throw new AppError(401, "Tour Cost is not found");
    }
    const totalAmmount = Number(tourCost.costFrom) * Number(payload.guestCount);
    const bookingPayload = {
      ...payload,
      user: userId,
      status: BOOKING_STATUS.PENDING,
    };
    const newUserBooking = await Booking.create([bookingPayload], { session });
    const initPayment = await Payment.create(
      [
        {
          booking: newUserBooking?.[0]._id,
          transactionId: transectionId,
          amount: totalAmmount,
          status: PAYMENT_STATUS.UNPAID,
        },
      ],
      { session }
    );
    const newUpdatedBooking = await Booking.findByIdAndUpdate(
      newUserBooking?.[0]._id,
      { payment: initPayment?.[0]._id },
      { new: true, session }
    )
      .populate("user")
      .populate("tour")
      .populate("payment");

    const name = (newUpdatedBooking?.user as any).name;
    const email = (newUpdatedBooking?.user as any).email;
    const title = (newUpdatedBooking?.tour as any).title;

    const sslCommerz: ISSLCommerz = {
      amount: totalAmmount,
      transactionId: transectionId,
      name: name,
      email: email,
      phoneNumber: "01709801305",
      address: "Nikunja-02,Dhaka",
    };

    const sslPayment = await SSLService.sslPaymentInit(sslCommerz);

    // SendEmail
    await sendEmail({
      to: email,
      subject: `Booking Created - ${title}`,
      tempName: "createBooking",
      tempData: {
        booking: newUpdatedBooking,
        paymentUrl: sslPayment.GatewayPageURL,
      },
    });

    // Last Part
    await session.commitTransaction();
    session.endSession();

    return {
      paymentUrl: sslPayment.GatewayPageURL,
      booking: newUpdatedBooking,
    };
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(401, err);
  }
};

const getAllBooking = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Booking.find(), query)
    .filter()
    .search(["status"])
    .sort()
    .paginate()
    .fields();
  const allBooking = await queryBuilder
    .build()
    .populate("user", "-password")
    .populate("payment")
    .populate("tour");
  return allBooking;
};

const getPersonsBooking = async (id: string) => {
  const bookingFound = await Booking.findOne({ user: id })
    .populate("user", "-password")
    .populate("payment")
    .populate("tour");
  if (!bookingFound) {
    throw new AppError(401, "Booking is not found of this user");
  }
  return bookingFound;
};

const deleteBooking = async (id: string, userId: string) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const bookingFound = await Booking.findById(id);
    if (!bookingFound) {
      throw new AppError(401, "Booking is not found of this user");
    }
    // console.log(bookingFound?.user.toString());
    if (userId !== bookingFound.user.toString()) {
      throw new AppError(401, "Booking is not belong to this user");
    }

    await Payment.findOneAndDelete({ _id: bookingFound.payment }, { session });
    await Booking.findByIdAndDelete(id, { session });

    await session.commitTransaction();
    session.endSession();
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(401, err);
  }
};

export const bookingServices = {
  createBooking,
  getAllBooking,
  getPersonsBooking,
  deleteBooking,
};
