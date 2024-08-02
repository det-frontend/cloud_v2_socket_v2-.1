"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletCheckStationHandler = exports.addCheckStationHandler = exports.getCheckStationHandler = void 0;
const helper_1 = __importDefault(require("../utils/helper"));
const checkStation_service_1 = require("../service/checkStation.service");
const getCheckStationHandler = async (req, res, next) => {
    try {
        let otpCodeCheck = req.query.otpCode;
        if (!otpCodeCheck)
            throw new Error("you need otp");
        let result = await (0, checkStation_service_1.getCheckStation)(req.query);
        (0, helper_1.default)(res, "CheckStation are here", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.getCheckStationHandler = getCheckStationHandler;
const addCheckStationHandler = async (req, res, next) => {
    try {
        let result = await (0, checkStation_service_1.addCheckStation)(req.body);
        (0, helper_1.default)(res, "New CheckStation was added", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.addCheckStationHandler = addCheckStationHandler;
const deletCheckStationHandler = async (req, res, next) => {
    try {
        await (0, checkStation_service_1.deleteCheckStation)(req.query);
        (0, helper_1.default)(res, "CheckStation was deleted");
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.deletCheckStationHandler = deletCheckStationHandler;
