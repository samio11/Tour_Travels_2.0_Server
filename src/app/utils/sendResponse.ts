import { Response } from "express";

type TSendResponse<T> = {
  success: true;
  statusCode: number;
  message: string;
  data: T | T[] | null;
};

export const sendResponse = <T>(res: Response, data: TSendResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data?.data,
  });
};
