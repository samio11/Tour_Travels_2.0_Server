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
exports.paymentServices = void 0;
const AppError_1 = require("../../errors/AppError");
const booking_interface_1 = require("../booking/booking.interface");
const booking_model_1 = require("../booking/booking.model");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const payment_interface_1 = require("./payment.interface");
const payment_model_1 = require("./payment.model");
const initPayment = (bookingId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findOne({ booking: bookingId });
    if (!payment) {
        throw new AppError_1.AppError(401, "No Payment for this booking is avalible");
    }
    const foundBooking = yield booking_model_1.Booking.findById(bookingId);
    if (userId !== (foundBooking === null || foundBooking === void 0 ? void 0 : foundBooking.user.toString())) {
        throw new AppError_1.AppError(401, "This Payment is not for this user");
    }
    const name = (foundBooking === null || foundBooking === void 0 ? void 0 : foundBooking.user).name;
    const email = (foundBooking === null || foundBooking === void 0 ? void 0 : foundBooking.user).email;
    const sslCommerz = {
        amount: payment.amount,
        transactionId: payment.transactionId,
        name: name,
        email: email,
        phoneNumber: "01709801305",
        address: "Nikunja-02,Dhaka",
    };
    const sslPayment = yield sslCommerz_service_1.SSLService.sslPaymentInit(sslCommerz);
    return {
        paymentUrl: sslPayment.GatewayPageURL,
    };
});
const successPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatePayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: payment_interface_1.PAYMENT_STATUS.PAID }, { new: true, session });
        yield booking_model_1.Booking.findOneAndUpdate({ payment: updatePayment === null || updatePayment === void 0 ? void 0 : updatePayment._id }, { status: booking_interface_1.BOOKING_STATUS.COMPLETE }, { new: true, session });
        yield session.commitTransaction();
        session.endSession();
        return { success: true, message: `Payment Completed` };
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
const failedPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatePayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: payment_interface_1.PAYMENT_STATUS.FAILED }, { new: true, session });
        yield booking_model_1.Booking.findOneAndUpdate({ payment: updatePayment === null || updatePayment === void 0 ? void 0 : updatePayment._id }, { status: booking_interface_1.BOOKING_STATUS.FAIL }, { new: true, session });
        yield session.commitTransaction();
        session.endSession();
        return { success: false, message: `Payment Failed` };
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
const cancelPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatePayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: payment_interface_1.PAYMENT_STATUS.CANCELLED }, { new: true, session });
        yield booking_model_1.Booking.findOneAndUpdate({ payment: updatePayment === null || updatePayment === void 0 ? void 0 : updatePayment._id }, { status: booking_interface_1.BOOKING_STATUS.CANCEL }, { new: true, session });
        yield session.commitTransaction();
        session.endSession();
        return { success: false, message: `Payment Canceled` };
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
exports.paymentServices = {
    initPayment,
    successPayment,
    failedPayment,
    cancelPayment,
};
