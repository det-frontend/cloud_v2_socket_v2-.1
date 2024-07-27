"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCheckStation = exports.addCheckStation = exports.getCheckStation = void 0;
const checkStation_model_1 = __importDefault(require("../model/checkStation.model"));
const getCheckStation = async (query) => {
    try {
        return checkStation_model_1.default
            .find(query)
            .select("-otpCode -__v")
            .lean();
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.getCheckStation = getCheckStation;
const addCheckStation = async (body) => {
    try {
        return new checkStation_model_1.default(body).save();
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.addCheckStation = addCheckStation;
const deleteCheckStation = async (query) => {
    try {
        return checkStation_model_1.default.deleteMany(query);
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.deleteCheckStation = deleteCheckStation;
