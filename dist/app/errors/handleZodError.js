"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodError = void 0;
const handleZodError = (err) => {
    const errorSources = err === null || err === void 0 ? void 0 : err.issues.map((x) => {
        return {
            path: x.path[x.path.length - 1],
            message: x.message,
        };
    });
    const statusCode = 400;
    return {
        statusCode,
        message: "Zod Error",
        errorSources,
    };
};
exports.handleZodError = handleZodError;
