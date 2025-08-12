"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    PORT: process.env.PORT,
    DATABASE: process.env.DATABASE,
    NODE_ENV: process.env.NODE_ENV,
    JWT_ACCESS_TOKEN: process.env.JWT_ACCESS_TOKEN,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
    JWT_REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
    BCRYPT_SALT: process.env.BCRYPT_SALT,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    SSL_STORE_ID: process.env.SSL_STORE_ID,
    SSL_STORE_PASS: process.env.SSL_STORE_PASS,
    SSL_PAYMENT_API: process.env.SSL_PAYMENT_API,
    SSL_VALIDATION_API: process.env.SSL_VALIDATION_API,
    SSL_SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL,
    SSL_FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL,
    SSL_CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL,
    SSL_SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL,
    SSL_FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL,
    SSL_CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL,
    CLOUDNARY_NAME: process.env.CLOUDNARY_NAME,
    CLOUDNARY_API_KEY: process.env.CLOUDNARY_API_KEY,
    CLOUDNARY_API_SECRET: process.env.CLOUDNARY_API_SECRET,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FORM: process.env.SMTP_FORM,
    RADIS_USERNAME: process.env.RADIS_USERNAME,
    RADIS_PASSWORD: process.env.RADIS_PASSWORD,
    RADIS_HOST: process.env.RADIS_HOST,
    RADIS_PORT: process.env.RADIS_PORT,
};
