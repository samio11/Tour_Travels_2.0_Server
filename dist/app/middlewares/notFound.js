"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const notFound = (err, req, res, next) => {
    res.status(404).json({
        success: false,
        message: "API not found",
        error: "",
    });
};
exports.notFound = notFound;
