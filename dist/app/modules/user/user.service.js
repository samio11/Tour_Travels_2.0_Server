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
exports.userServices = void 0;
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("./user.model");
const AppError_1 = require("../../errors/AppError");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existUser = yield user_model_1.User.findOne({ email: payload.email });
    if (existUser) {
        throw new AppError_1.AppError(401, "User is already exists");
    }
    const hashPassword = yield bcrypt_1.default.hash(payload.password, Number(config_1.default.BCRYPT_SALT));
    const authProvider = {
        provider: "credentials",
        providerId: payload.email,
    };
    const userPayload = Object.assign(Object.assign({}, payload), { password: hashPassword, auths: [authProvider] });
    const newUser = yield user_model_1.User.create(userPayload);
    return newUser;
});
const getMe = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    //   console.log(decodedToken);
    const existUser = yield user_model_1.User.findOne({ email: decodedToken.email });
    console.log(existUser);
    if (!existUser) {
        throw new AppError_1.AppError(401, "user is not Exists");
    }
    return existUser;
});
const getAllUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("In Get all user", query);
    const queryBuilder = new QueryBuilder_1.QueryBuilder(user_model_1.User.find(), query)
        .filter()
        .search(["name"])
        .sort()
        .paginate()
        .fields();
    const result = yield queryBuilder.build();
    console.log(result);
    return result;
});
exports.userServices = { createUser, getMe, getAllUser };
