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
exports.searchCoustomer = exports.deleteCoustomer = exports.updateCoustomer = exports.addCoustomer = exports.getCoustomerById = exports.getCoustomer = void 0;
const coustomer_model_1 = __importDefault(require("../model/coustomer.model"));
const getCoustomer = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield coustomer_model_1.default.find(query).lean().select("-__v");
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.getCoustomer = getCoustomer;
const getCoustomerById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield coustomer_model_1.default.findById(id).select("-__v");
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.getCoustomerById = getCoustomerById;
const addCoustomer = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield new coustomer_model_1.default(body).save();
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.addCoustomer = addCoustomer;
const updateCoustomer = (id, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield coustomer_model_1.default.findByIdAndUpdate(id, body).select("-password -__v");
        return yield coustomer_model_1.default.findById(id).lean();
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.updateCoustomer = updateCoustomer;
const deleteCoustomer = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield coustomer_model_1.default.deleteMany(query);
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.deleteCoustomer = deleteCoustomer;
const searchCoustomer = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let key = query.key.toLowerCase();
        if (typeof key !== "string") {
            throw new Error("Invalid search key. Expected a string.");
        }
        let result = yield coustomer_model_1.default.find({
            $or: [{ cou_name: { $regex: key } }],
        });
        return result;
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.searchCoustomer = searchCoustomer;
