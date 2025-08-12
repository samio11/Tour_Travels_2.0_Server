import { Response } from "express";

type TSetCookie = {
  accessToken?: string;
  refreshToken?: string;
};

export const setCookies = (res: Response, tokenData: TSetCookie) => {
  if (tokenData.accessToken) {
    res.cookie("accessToken", tokenData.accessToken, {
      httpOnly: true,
      secure: false,
    });
  }
  if (tokenData.refreshToken) {
    res.cookie("refreshToken", tokenData.refreshToken, {
      httpOnly: true,
      secure: false,
    });
  }
};
