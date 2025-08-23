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
exports.tourServices = void 0;
const AppError_1 = require("../../errors/AppError");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const tour_model_1 = require("./tour.model");
const createTourType = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existTour = yield tour_model_1.TourType.findOne({ name: payload.name });
    if (existTour) {
        throw new AppError_1.AppError(401, "Tour Type is already Exists");
    }
    const newTourType = yield tour_model_1.TourType.create(payload);
    return newTourType;
});
const createTour = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existTour = yield tour_model_1.Tour.findOne({ name: payload.title });
    if (existTour) {
        throw new AppError_1.AppError(401, "Tour is already Exists");
    }
    const newTourType = yield tour_model_1.Tour.create(payload);
    return newTourType;
});
const getAllTourType = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(tour_model_1.TourType.find(), query)
        .filter()
        .search(["name"])
        .sort()
        .paginate()
        .fields();
    const tourTypeData = yield queryBuilder.build();
    return tourTypeData;
});
const getAllTour = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(tour_model_1.Tour.find(), query)
        .filter()
        .search(["title"])
        .sort()
        .paginate()
        .fields();
    const tourData = yield queryBuilder
        .build()
        .populate("tourType")
        .populate("division");
    return tourData;
});
const getATourType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const tourTypeExists = yield tour_model_1.TourType.findById(id);
    if (!tourTypeExists) {
        throw new AppError_1.AppError(401, "This Tour Type Not Exists");
    }
    return tourTypeExists;
});
const getATour = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const tourExists = yield tour_model_1.Tour.findOne({ slug });
    if (!tourExists) {
        throw new AppError_1.AppError(401, "This Tour Not Exists");
    }
    return tourExists;
});
const deleteATourType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedTour = yield tour_model_1.TourType.findByIdAndDelete(id);
    return deletedTour;
});
exports.tourServices = {
    createTourType,
    getAllTourType,
    getATourType,
    createTour,
    getAllTour,
    getATour,
    deleteATourType,
};
