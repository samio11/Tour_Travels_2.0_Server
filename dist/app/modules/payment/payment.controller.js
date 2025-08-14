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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const config_1 = __importDefault(require("../../config"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const payment_service_1 = require("./payment.service");
const initPayment = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookingId } = req.params;
    const { userId } = req.user;
    const result = yield payment_service_1.paymentServices.initPayment(bookingId, userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Payment Url given!!",
        data: result,
    });
}));
const successPayment = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield payment_service_1.paymentServices.successPayment(query);
    if (result.success) {
        res.redirect(`${config_1.default.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
    }
}));
const failedPayment = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield payment_service_1.paymentServices.failedPayment(query);
    if (!result.success) {
        res.redirect(`${config_1.default.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
    }
}));
const cancelPayment = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield payment_service_1.paymentServices.cancelPayment(query);
    if (!result.success) {
        res.redirect(`${config_1.default.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
    }
}));
exports.paymentController = {
    initPayment,
    successPayment,
    failedPayment,
    cancelPayment,
};
