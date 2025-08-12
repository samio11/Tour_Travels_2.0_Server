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
exports.seedSuperAdmin = void 0;
const config_1 = __importDefault(require("../config"));
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const sendEmail_1 = require("./sendEmail");
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const existUser = yield user_model_1.User.findOne({ email: config_1.default.SUPER_ADMIN_EMAIL });
    if (existUser) {
        console.log(`Super admin already exist`);
        return;
    }
    const hashPassword = yield bcrypt_1.default.hash(config_1.default.SUPER_ADMIN_PASSWORD, Number(config_1.default.BCRYPT_SALT));
    const authProvider = {
        provider: "credentials",
        providerId: config_1.default.SUPER_ADMIN_EMAIL,
    };
    const payload = {
        name: "Samio Hasan",
        email: config_1.default.SUPER_ADMIN_EMAIL,
        password: hashPassword,
        role: user_interface_1.Role.SUPER_ADMIN,
        auths: [authProvider],
    };
    const newSuperAdmin = yield user_model_1.User.create(payload);
    if (newSuperAdmin) {
        console.log(`Super Admin Created Done`);
        yield (0, sendEmail_1.sendEmail)({
            to: newSuperAdmin.email,
            subject: "Welcome To Tour And Travel 2.0",
            tempName: "welcome",
            tempData: {
                companyName: "Tour-Travels-2.0",
                bannerImageUrl: "https://www.shutterstock.com/image-photo/happy-traveler-woman-on-boat-260nw-2337247887.jpg",
                name: newSuperAdmin.name,
            },
        });
    }
});
exports.seedSuperAdmin = seedSuperAdmin;
