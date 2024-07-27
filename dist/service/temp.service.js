"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTemp = exports.addTemp = exports.getTemp = void 0;
const temp_model_1 = __importDefault(require("../model/temp.model"));
const getTemp = async (query) => {
    try {
        return temp_model_1.default
            .find(query)
            .populate("stationId")
            .select("-otpCode -__v")
            .lean();
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.getTemp = getTemp;
const addTemp = async (body) => {
    try {
        return new temp_model_1.default(body).save();
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.addTemp = addTemp;
const deleteTemp = async (query) => {
    try {
        return temp_model_1.default.deleteMany(query);
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.deleteTemp = deleteTemp;
