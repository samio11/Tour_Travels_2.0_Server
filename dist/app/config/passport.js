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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const user_model_1 = require("../modules/user/user.model");
const user_interface_1 = require("../modules/user/user.interface");
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const _1 = __importDefault(require("."));
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!email) {
            return done(null, false, { message: "Email not found" });
        }
        const existUser = yield user_model_1.User.findOne({ email });
        if (!existUser) {
            return done(null, false, { message: "User not found" });
        }
        if (existUser.isVerified === false) {
            return done(null, false, { message: "User is verified" });
        }
        if (existUser.isActive === user_interface_1.IsActive.INACTIVE ||
            existUser.isActive === user_interface_1.IsActive.BLOCKED) {
            return done(null, false, {
                message: `User is :-${existUser.isActive}`,
            });
        }
        if (existUser.isDeleted === true) {
            return done(null, false, { message: "User is Deleted" });
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, existUser.password);
        if (!passwordMatch) {
            return done(null, false, { message: "Password Does not matched" });
        }
        const isGoogleAuthenticated = existUser.auths.some((x) => x.provider === "google");
        if (isGoogleAuthenticated) {
            return done(null, false, { message: "Please do google login" });
        }
        return done(null, existUser);
    }
    catch (err) {
        return done(err);
    }
})));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: _1.default.GOOGLE_CLIENT_ID,
    clientSecret: _1.default.GOOGLE_CLIENT_SECRET,
    callbackURL: _1.default.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const email = (_a = profile === null || profile === void 0 ? void 0 : profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
        if (!email) {
            return done(null, false, { message: "Email not found" });
        }
        let existUser = yield user_model_1.User.findOne({ email });
        if (!existUser) {
            existUser = yield user_model_1.User.create({
                name: profile.displayName,
                email: email,
                picture: (_b = profile === null || profile === void 0 ? void 0 : profile.photos) === null || _b === void 0 ? void 0 : _b[0].value,
                role: user_interface_1.Role.USER,
                auths: [
                    {
                        provider: "google",
                        providerId: profile === null || profile === void 0 ? void 0 : profile.id,
                    },
                ],
            });
        }
        if (existUser.isActive === user_interface_1.IsActive.INACTIVE ||
            existUser.isActive === user_interface_1.IsActive.BLOCKED) {
            return done(null, false, {
                message: `User is :-${existUser.isActive}`,
            });
        }
        if (existUser.isDeleted === true) {
            return done(null, false, { message: "User is Deleted" });
        }
        return done(null, existUser);
    }
    catch (err) {
        return done(err);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        console.log(error);
        done(error);
    }
}));
