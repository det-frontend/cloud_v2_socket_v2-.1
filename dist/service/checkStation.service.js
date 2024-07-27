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
exports.deleteCheckStation = exports.addCheckStation = exports.getCheckStation = void 0;
const checkStation_model_1 = __importDefault(require("../model/checkStation.model"));
const getCheckStation = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return checkStation_model_1.default
            .find(query)
            .select("-otpCode -__v")
            .lean();
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.getCheckStation = getCheckStation;
const addCheckStation = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return new checkStation_model_1.default(body).save();
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.addCheckStation = addCheckStation;
const deleteCheckStation = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return checkStation_model_1.default.deleteMany(query);
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.deleteCheckStation = deleteCheckStation;
