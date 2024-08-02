"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionAddService = exports.getAllStationDetails = exports.deleteStationDetail = exports.updateStationDetail = exports.addStationDetail = exports.stationDetailPaginate = exports.getStationDetail = void 0;
const stationDetail_model_1 = require("../model/stationDetail.model");
const config_1 = __importDefault(require("config"));
const helper_1 = require("../utils/helper");
// export const getStationDetail = async (
//   query: FilterQuery<stationDetailDocument>
// ) => {
//   try {
//     let ksData = await ksdbModel.find(query).lean().select("-__v");
//     let csData = await csStationDetailModel.find(query).lean().select("-__v");
//     return [ksData , csData]
//   } catch (e: any) {
//     throw new Error(e);
//   }
// };
const getStationDetail = async (query, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, stationDetail_model_1.ksStationDetailModel, stationDetail_model_1.csStationDetailModel);
        return await selectedModel.find(query).lean().select("-__v");
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.getStationDetail = getStationDetail;
const stationDetailPaginate = async (pageNo, query, dbModel) => {
    const limitNo = config_1.default.get("page_limit");
    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;
    let selectedModel = (0, helper_1.dBSelector)(dbModel, stationDetail_model_1.ksStationDetailModel, stationDetail_model_1.csStationDetailModel);
    const data = await selectedModel
        .find(query)
        .skip(skipCount)
        .limit(limitNo)
        .lean()
        .select("-__v");
    const count = await selectedModel.countDocuments(query);
    return { data, count };
};
exports.stationDetailPaginate = stationDetailPaginate;
const addStationDetail = async (body, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, stationDetail_model_1.ksStationDetailModel, stationDetail_model_1.csStationDetailModel);
        return await new selectedModel(body).save();
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.addStationDetail = addStationDetail;
const updateStationDetail = async (query, body, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, stationDetail_model_1.ksStationDetailModel, stationDetail_model_1.csStationDetailModel);
        await selectedModel.updateMany(query, body);
        return await selectedModel.find(query).lean();
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.updateStationDetail = updateStationDetail;
const deleteStationDetail = async (query, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, stationDetail_model_1.ksStationDetailModel, stationDetail_model_1.csStationDetailModel);
        let StationDetail = await selectedModel.find(query);
        if (!StationDetail) {
            throw new Error("No StationDetail with that id");
        }
        return await selectedModel.deleteMany(query);
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.deleteStationDetail = deleteStationDetail;
const getAllStationDetails = async (dbModel, query) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, stationDetail_model_1.ksStationDetailModel, stationDetail_model_1.csStationDetailModel);
        return await selectedModel.find(query);
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.getAllStationDetails = getAllStationDetails;
const permissionAddService = async (stationId, name, dbModel, pipeLine) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, stationDetail_model_1.ksStationDetailModel, stationDetail_model_1.csStationDetailModel);
        await selectedModel.findByIdAndUpdate({ _id: stationId }, pipeLine);
        return await selectedModel.findById({ _id: stationId });
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.permissionAddService = permissionAddService;
