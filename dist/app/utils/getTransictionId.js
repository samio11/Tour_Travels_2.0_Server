"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransictionId = void 0;
const getTransictionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
exports.getTransictionId = getTransictionId;
