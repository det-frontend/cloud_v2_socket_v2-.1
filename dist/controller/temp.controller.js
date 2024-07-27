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
exports.deletTempHandler = exports.addTempHandler = exports.getTempHandler = void 0;
const helper_1 = __importDefault(require("../utils/helper"));
const temp_service_1 = require("../service/temp.service");
const getTempHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let otpCodeCheck = req.query.otpCode;
        if (!otpCodeCheck)
            throw new Error("you need otp");
        let result = yield (0, temp_service_1.getTemp)(req.query);
        (0, helper_1.default)(res, "Temp are here", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.getTempHandler = getTempHandler;
const addTempHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield (0, temp_service_1.addTemp)(req.body);
        (0, helper_1.default)(res, "New Temp was added", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.addTempHandler = addTempHandler;
const deletTempHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, temp_service_1.deleteTemp)(req.query);
        (0, helper_1.default)(res, "Temp was deleted");
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.deletTempHandler = deletTempHandler;
