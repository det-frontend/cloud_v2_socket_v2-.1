"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePermit = exports.addPermit = exports.getPermit = void 0;
const permit_model_1 = __importDefault(require("../model/permit.model"));
const getPermit = async (query) => {
    try {
        return permit_model_1.default.find(query).lean();
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.getPermit = getPermit;
const addPermit = async (body) => {
    try {
        return new permit_model_1.default(body).save();
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.addPermit = addPermit;
const deletePermit = async (query) => {
    try {
        return permit_model_1.default.deleteMany(query);
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.deletePermit = deletePermit;
