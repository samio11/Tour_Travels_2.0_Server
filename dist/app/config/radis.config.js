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
exports.redisConnection = exports.radisClient = void 0;
const redis_1 = require("redis");
const _1 = __importDefault(require("."));
exports.radisClient = (0, redis_1.createClient)({
    username: _1.default.RADIS_USERNAME,
    password: _1.default.RADIS_PASSWORD,
    socket: {
        host: _1.default.RADIS_HOST,
        port: Number(_1.default.RADIS_PORT),
    },
});
exports.radisClient.on("error", (err) => console.log("Redis Client Error", err));
// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar
const redisConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!exports.radisClient.isOpen) {
        yield exports.radisClient.connect();
        console.log(`Radis Connected Successfully`);
    }
});
exports.redisConnection = redisConnection;
