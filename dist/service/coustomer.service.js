"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCoustomer = exports.deleteCoustomer = exports.updateCoustomer = exports.addCoustomer = exports.getCoustomerById = exports.getCoustomer = void 0;
const coustomer_model_1 = __importDefault(require("../model/coustomer.model"));
const getCoustomer = async (query) => {
    try {
        return await coustomer_model_1.default.find(query).lean().select("-__v");
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.getCoustomer = getCoustomer;
const getCoustomerById = async (id) => {
    try {
        return await coustomer_model_1.default.findById(id).select("-__v");
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.getCoustomerById = getCoustomerById;
const addCoustomer = async (body) => {
    try {
        return await new coustomer_model_1.default(body).save();
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.addCoustomer = addCoustomer;
const updateCoustomer = async (id, body) => {
    try {
        await coustomer_model_1.default.findByIdAndUpdate(id, body).select("-password -__v");
        return await coustomer_model_1.default.findById(id).lean();
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.updateCoustomer = updateCoustomer;
const deleteCoustomer = async (query) => {
    try {
        return await coustomer_model_1.default.deleteMany(query);
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.deleteCoustomer = deleteCoustomer;
const searchCoustomer = async (query) => {
    try {
        let key = query.key.toLowerCase();
        if (typeof key !== "string") {
            throw new Error("Invalid search key. Expected a string.");
        }
        let result = await coustomer_model_1.default.find({
            $or: [{ cou_name: { $regex: key } }],
        });
        return result;
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.searchCoustomer = searchCoustomer;
