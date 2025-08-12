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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const AppError_1 = require("../errors/AppError");
const transporter = nodemailer_1.default.createTransport({
    host: config_1.default.SMTP_HOST,
    port: Number(config_1.default.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
const sendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, tempName, tempData, attachments, }) {
    try {
        const tempPath = path_1.default.join(__dirname, `templates/${tempName}.ejs`);
        const html = yield ejs_1.default.renderFile(tempPath, tempData);
        const info = yield transporter.sendMail({
            to: to,
            from: config_1.default.SMTP_FORM,
            subject: subject,
            html: html,
            attachments: attachments === null || attachments === void 0 ? void 0 : attachments.map((x) => ({
                filename: x.fileName,
                content: x.content,
                contentType: x.contentType,
            })),
        });
        console.log(`Email Send:- ${info.messageId}`);
    }
    catch (err) {
        throw new AppError_1.AppError(401, `Email Send Failed, ${err === null || err === void 0 ? void 0 : err.message}`);
    }
});
exports.sendEmail = sendEmail;
