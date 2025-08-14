"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingServices = void 0;
const AppError_1 = require("../../errors/AppError");
const getTransictionId_1 = require("../../utils/getTransictionId");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const sendEmail_1 = require("../../utils/sendEmail");
const payment_interface_1 = require("../payment/payment.interface");
const payment_model_1 = require("../payment/payment.model");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const tour_model_1 = require("../tour/tour.model");
const user_model_1 = require("../user/user.model");
const booking_interface_1 = require("./booking.interface");
const booking_model_1 = require("./booking.model");
const createBooking = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const transectionId = (0, getTransictionId_1.getTransictionId)();
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const user = yield user_model_1.User.findById(userId);
        const tourCost = yield tour_model_1.Tour.findById(payload.tour).select("costFrom");
        if (!tourCost) {
            throw new AppError_1.AppError(401, "Tour is not found");
        }
        if (!(tourCost === null || tourCost === void 0 ? void 0 : tourCost.costFrom)) {
            throw new AppError_1.AppError(401, "Tour Cost is not found");
        }
        const totalAmmount = Number(tourCost.costFrom) * Number(payload.guestCount);
        const bookingPayload = Object.assign(Object.assign({}, payload), { user: userId, status: booking_interface_1.BOOKING_STATUS.PENDING });
        const newUserBooking = yield booking_model_1.Booking.create([bookingPayload], { session });
        const initPayment = yield payment_model_1.Payment.create([
            {
                booking: newUserBooking === null || newUserBooking === void 0 ? void 0 : newUserBooking[0]._id,
                transactionId: transectionId,
                amount: totalAmmount,
                status: payment_interface_1.PAYMENT_STATUS.UNPAID,
            },
        ], { session });
        const newUpdatedBooking = yield booking_model_1.Booking.findByIdAndUpdate(newUserBooking === null || newUserBooking === void 0 ? void 0 : newUserBooking[0]._id, { payment: initPayment === null || initPayment === void 0 ? void 0 : initPayment[0]._id }, { new: true, session })
            .populate("user")
            .populate("tour")
            .populate("payment");
        const name = (newUpdatedBooking === null || newUpdatedBooking === void 0 ? void 0 : newUpdatedBooking.user).name;
        const email = (newUpdatedBooking === null || newUpdatedBooking === void 0 ? void 0 : newUpdatedBooking.user).email;
        const title = (newUpdatedBooking === null || newUpdatedBooking === void 0 ? void 0 : newUpdatedBooking.tour).title;
        const sslCommerz = {
            amount: totalAmmount,
            transactionId: transectionId,
            name: name,
            email: email,
            phoneNumber: "01709801305",
            address: "Nikunja-02,Dhaka",
        };
        const sslPayment = yield sslCommerz_service_1.SSLService.sslPaymentInit(sslCommerz);
        // SendEmail
        yield (0, sendEmail_1.sendEmail)({
            to: email,
            subject: `Booking Created - ${title}`,
            tempName: "createBooking",
            tempData: {
                booking: newUpdatedBooking,
                paymentUrl: sslPayment.GatewayPageURL,
            },
        });
        // Last Part
        yield session.commitTransaction();
        session.endSession();
        return {
            paymentUrl: sslPayment.GatewayPageURL,
            booking: newUpdatedBooking,
        };
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.AppError(401, err);
    }
});
const getAllBooking = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(booking_model_1.Booking.find(), query)
        .filter()
        .search(["status"])
        .sort()
        .paginate()
        .fields();
    const allBooking = yield queryBuilder
        .build()
        .populate("user", "-password")
        .populate("payment")
        .populate("tour");
    return allBooking;
});
const getPersonsBooking = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingFound = yield booking_model_1.Booking.findOne({ user: id })
        .populate("user", "-password")
        .populate("payment")
        .populate("tour");
    if (!bookingFound) {
        throw new AppError_1.AppError(401, "Booking is not found of this user");
    }
    return bookingFound;
});
const deleteBooking = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const bookingFound = yield booking_model_1.Booking.findById(id);
        if (!bookingFound) {
            throw new AppError_1.AppError(401, "Booking is not found of this user");
        }
        // console.log(bookingFound?.user.toString());
        if (userId !== bookingFound.user.toString()) {
            throw new AppError_1.AppError(401, "Booking is not belong to this user");
        }
        yield payment_model_1.Payment.findOneAndDelete({ _id: bookingFound.payment }, { session });
        yield booking_model_1.Booking.findByIdAndDelete(id, { session });
        yield session.commitTransaction();
        session.endSession();
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.AppError(401, err);
    }
});
exports.bookingServices = {
    createBooking,
    getAllBooking,
    getPersonsBooking,
    deleteBooking,
};
