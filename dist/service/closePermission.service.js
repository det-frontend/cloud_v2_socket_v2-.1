"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePermissionService = exports.updatePermissionService = exports.addPerissionService = exports.getAClosePermissionService = exports.getAllClosePermissionService = void 0;
const closePermission_model_1 = __importDefault(require("../model/closePermission.model"));
const getAllClosePermissionService = async (dbModel, query) => {
    let selectedModel = closePermission_model_1.default;
    return await selectedModel.find(query);
};
exports.getAllClosePermissionService = getAllClosePermissionService;
const getAClosePermissionService = async (dbModel, query) => {
    let selectedModel = closePermission_model_1.default;
    return await selectedModel.findOne(query);
};
exports.getAClosePermissionService = getAClosePermissionService;
const addPerissionService = async (body, dbModel) => {
    let selectedModel = closePermission_model_1.default;
    return await new selectedModel(body).save();
};
exports.addPerissionService = addPerissionService;
const updatePermissionService = async (body, id, dbModel) => {
    let selectedModel = closePermission_model_1.default;
    await selectedModel.findByIdAndUpdate({ _id: id }, body);
    return await selectedModel.find({ _id: id });
};
exports.updatePermissionService = updatePermissionService;
const deletePermissionService = async (id, dbModel) => {
    let selectedModel = closePermission_model_1.default;
    return await selectedModel.deleteOne({ stationDetailId: id });
};
exports.deletePermissionService = deletePermissionService;
