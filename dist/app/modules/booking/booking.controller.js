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
exports.bookingController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const booking_service_1 = require("./booking.service");
const sendResponse_1 = require("../../utils/sendResponse");
const createBooking = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const { userId } = decodedToken;
    const userData = req.body;
    const result = yield booking_service_1.bookingServices.createBooking(userData, userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Booking Created",
        data: result,
    });
}));
const getAllBooking = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req === null || req === void 0 ? void 0 : req.query;
    const result = yield booking_service_1.bookingServices.getAllBooking(query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Getting All Booked Tour",
        data: result,
    });
}));
const getABooking = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield booking_service_1.bookingServices.getPersonsBooking(userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Getting Your Booked Tour",
        data: result,
    });
}));
const deleteBooking = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookingId } = req.params;
    const { userId } = req.user;
    yield booking_service_1.bookingServices.deleteBooking(bookingId, userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Booking is Deleted",
        data: null,
    });
}));
exports.bookingController = {
    createBooking,
    getAllBooking,
    getABooking,
    deleteBooking,
};
