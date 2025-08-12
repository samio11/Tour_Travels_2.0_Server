import nodemailer from "nodemailer";
import config from "../config";
import path from "path";
import ejs from "ejs";
import { AppError } from "../errors/AppError";
const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST as string,
  port: Number(config.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

type TSendEmail = {
  to: string;
  subject: string;
  tempName: string;
  tempData?: Record<string, any>;
  attachments?: {
    fileName: string;
    content: Buffer | string;
    contentType: string;
  }[];
};

export const sendEmail = async ({
  to,
  subject,
  tempName,
  tempData,
  attachments,
}: TSendEmail) => {
  try {
    const tempPath = path.join(__dirname, `templates/${tempName}.ejs`);
    const html = await ejs.renderFile(tempPath, tempData);
    const info = await transporter.sendMail({
      to: to,
      from: config.SMTP_FORM as string,
      subject: subject,
      html: html,
      attachments: attachments?.map((x) => ({
        filename: x.fileName,
        content: x.content,
        contentType: x.contentType,
      })),
    });
    console.log(`Email Send:- ${info.messageId}`);
  } catch (err: any) {
    throw new AppError(401, `Email Send Failed, ${err?.message}`);
  }
};
