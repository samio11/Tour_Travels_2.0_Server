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
Object.defineProperty(exports, "__esModule", { value: true });
exports.tourControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const tour_services_1 = require("./tour.services");
const createTourType = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const result = yield tour_services_1.tourServices.createTourType(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        message: "Tour Type Created Successful",
        success: true,
        data: result,
    });
}));
const createTour = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = Object.assign(Object.assign({}, JSON.parse(req.body.data)), { images: req.files.map((x) => x.path) });
    const result = yield tour_services_1.tourServices.createTour(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        message: "Tour Created Successful",
        success: true,
        data: result,
    });
}));
const getAllTourType = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req === null || req === void 0 ? void 0 : req.query;
    const result = yield tour_services_1.tourServices.getAllTourType(query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: "All Tour Type Retrived",
        success: true,
        data: result,
    });
}));
const getAllTour = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req === null || req === void 0 ? void 0 : req.query;
    const result = yield tour_services_1.tourServices.getAllTour(query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: "All Tour Retrived",
        success: true,
        data: result,
    });
}));
const getATourType = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req === null || req === void 0 ? void 0 : req.params;
    const result = yield tour_services_1.tourServices.getATourType(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: "A Tour Type Retrived",
        success: true,
        data: result,
    });
}));
const getATour = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req === null || req === void 0 ? void 0 : req.params;
    const result = yield tour_services_1.tourServices.getATour(slug);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: "A Tour Retrived",
        success: true,
        data: result,
    });
}));
const deleteATourType = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req === null || req === void 0 ? void 0 : req.params;
    const result = yield tour_services_1.tourServices.deleteATourType(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: "A Tour Type Deleted",
        success: true,
        data: result,
    });
}));
const deleteATour = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req === null || req === void 0 ? void 0 : req.params;
    const result = yield tour_services_1.tourServices.deleteATour(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: "A Tour Deleted",
        success: true,
        data: result,
    });
}));
exports.tourControllers = {
    createTourType,
    getAllTourType,
    getATourType,
    createTour,
    getAllTour,
    getATour,
    deleteATourType,
    deleteATour,
};
