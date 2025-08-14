import { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentServices } from "./payment.service";

const initPayment = catchAsync(async (req, res, next) => {
  const { bookingId } = req.params;
  const { userId } = req.user as JwtPayload;
  const result = await paymentServices.initPayment(bookingId, userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Payment Url given!!",
    data: result,
  });
});

const successPayment = catchAsync(async (req, res, next) => {
  const query = req.query;
  const result = await paymentServices.successPayment(
    query as Record<string, string>
  );
  if (result.success) {
    res.redirect(
      `${config.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});
const failedPayment = catchAsync(async (req, res, next) => {
  const query = req.query;
  const result = await paymentServices.failedPayment(
    query as Record<string, string>
  );
  if (!result.success) {
    res.redirect(
      `${config.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});
const cancelPayment = catchAsync(async (req, res, next) => {
  const query = req.query;
  const result = await paymentServices.cancelPayment(
    query as Record<string, string>
  );
  if (!result.success) {
    res.redirect(
      `${config.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});

export const paymentController = {
  initPayment,
  successPayment,
  failedPayment,
  cancelPayment,
};
