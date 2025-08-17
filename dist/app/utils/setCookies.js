"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookies = void 0;
const setCookies = (res, tokenData) => {
    if (tokenData.accessToken) {
        res.cookie("accessToken", tokenData.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
    }
    if (tokenData.refreshToken) {
        res.cookie("refreshToken", tokenData.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
    }
};
exports.setCookies = setCookies;
