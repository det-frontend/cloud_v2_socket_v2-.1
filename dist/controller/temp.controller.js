"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletTempHandler = exports.addTempHandler = exports.getTempHandler = void 0;
const helper_1 = __importDefault(require("../utils/helper"));
const temp_service_1 = require("../service/temp.service");
const getTempHandler = async (req, res, next) => {
    try {
        let otpCodeCheck = req.query.otpCode;
        if (!otpCodeCheck)
            throw new Error("you need otp");
        let result = await (0, temp_service_1.getTemp)(req.query);
        (0, helper_1.default)(res, "Temp are here", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.getTempHandler = getTempHandler;
const addTempHandler = async (req, res, next) => {
    try {
        let result = await (0, temp_service_1.addTemp)(req.body);
        (0, helper_1.default)(res, "New Temp was added", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.addTempHandler = addTempHandler;
const deletTempHandler = async (req, res, next) => {
    try {
        await (0, temp_service_1.deleteTemp)(req.query);
        (0, helper_1.default)(res, "Temp was deleted");
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.deletTempHandler = deletTempHandler;
