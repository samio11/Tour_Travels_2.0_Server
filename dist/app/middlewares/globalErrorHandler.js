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
exports.globalErrorHandler = void 0;
const cloudinary_config_1 = require("../config/cloudinary.config");
const handleCastError_1 = require("../errors/handleCastError");
const handleZodError_1 = require("../errors/handleZodError");
const handleValidationError_1 = require("../errors/handleValidationError");
const handleDuplicateError_1 = require("../errors/handleDuplicateError");
const AppError_1 = require("../errors/AppError");
const config_1 = __importDefault(require("../config"));
const globalErrorHandler = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        yield (0, cloudinary_config_1.deleteImageFromCloudinary)(req.file.path);
    }
    if (req.files && req.files.length) {
        const excludingFiles = req.files.map((x) => x.path);
        yield Promise.all(excludingFiles.map((x) => (0, cloudinary_config_1.deleteImageFromCloudinary)(x)));
    }
    let statusCode = 500;
    let message = "Something went wrong!!!";
    let errorSources = [
        {
            path: "",
            message: "Opps! Error",
        },
    ];
    if (err.code === 11000) {
        const x = (0, handleDuplicateError_1.handleDuplicateError)(err);
        statusCode = x.statusCode;
        message = x.message;
        errorSources = x.errorSources;
    }
    else if (err.name === "ZodError") {
        const x = (0, handleZodError_1.handleZodError)(err);
        statusCode = x.statusCode;
        message = x.message;
        errorSources = x.errorSources;
    }
    else if (err.name === "ValidationError") {
        const x = (0, handleValidationError_1.handleValidationError)(err);
        statusCode = x.statusCode;
        message = x.message;
        errorSources = x.errorSources;
    }
    else if (err.name === "CastError") {
        const x = (0, handleCastError_1.handleCastError)(err);
        statusCode = x.statusCode;
        message = x.message;
        errorSources = x.errorSources;
    }
    else if (err instanceof AppError_1.AppError) {
        statusCode = err === null || err === void 0 ? void 0 : err.statusCode;
        message = err === null || err === void 0 ? void 0 : err.message;
        errorSources = [
            {
                path: "",
                message: err === null || err === void 0 ? void 0 : err.message,
            },
        ];
    }
    else if (err instanceof Error) {
        message = err === null || err === void 0 ? void 0 : err.message;
        errorSources = [
            {
                path: "",
                message: err === null || err === void 0 ? void 0 : err.message,
            },
        ];
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        stack: config_1.default.NODE_ENV === "development" ? err === null || err === void 0 ? void 0 : err.stack : "",
    });
});
exports.globalErrorHandler = globalErrorHandler;
