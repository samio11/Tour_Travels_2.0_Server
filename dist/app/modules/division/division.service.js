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
exports.divisionService = void 0;
const AppError_1 = require("../../errors/AppError");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const division_model_1 = require("./division.model");
const createDivision = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existDivision = yield division_model_1.Division.findOne({ name: payload.name });
    if (existDivision) {
        throw new AppError_1.AppError(401, "Division is already created");
    }
    const division = yield division_model_1.Division.create(payload);
    return division;
});
const getAllDivision = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(division_model_1.Division.find(), query)
        .filter()
        .search(["name"])
        .sort()
        .paginate()
        .fields();
    const divisionData = yield queryBuilder.build();
    return divisionData;
});
const getADivision = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const divisionData = yield division_model_1.Division.findOne({ slug: slug });
    if (!divisionData) {
        throw new AppError_1.AppError(401, "Division not found");
    }
    return divisionData;
});
const deleteDivision = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield division_model_1.Division.findByIdAndDelete(id);
    return result;
});
exports.divisionService = {
    createDivision,
    getAllDivision,
    getADivision,
    deleteDivision,
};
