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
//   } catch (e) {
//     throw new Error(e);
//   }
// };
const getStationDetail = (query, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, stationDetail_model_1.ksStationDetailModel, stationDetail_model_1.csStationDetailModel);
        return yield selectedModel.find(query).lean().select("-__v");
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.getStationDetail = getStationDetail;
const stationDetailPaginate = (pageNo, query, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    const limitNo = config_1.default.get("page_limit");
    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;
    let selectedModel = (0, helper_1.dBSelector)(dbModel, stationDetail_model_1.ksStationDetailModel, stationDetail_model_1.csStationDetailModel);
    const data = yield selectedModel
        .find(query)
        .skip(skipCount)
        .limit(limitNo)
        .lean()
        .select("-__v");
    const count = yield selectedModel.countDocuments(query);
    return { data, count };
});
exports.stationDetailPaginate = stationDetailPaginate;
const addStationDetail = (body, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, stationDetail_model_1.ksStationDetailModel, stationDetail_model_1.csStationDetailModel);
        return yield new selectedModel(body).save();
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.addStationDetail = addStationDetail;
const updateStationDetail = (query, body, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, stationDetail_model_1.ksStationDetailModel, stationDetail_model_1.csStationDetailModel);
        yield selectedModel.updateMany(query, body);
        return yield selectedModel.find(query).lean();
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.updateStationDetail = updateStationDetail;
const deleteStationDetail = (query, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, stationDetail_model_1.ksStationDetailModel, stationDetail_model_1.csStationDetailModel);
        let StationDetail = yield selectedModel.find(query);
        if (!StationDetail) {
            throw new Error("No StationDetail with that id");
        }
        return yield selectedModel.deleteMany(query);
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.deleteStationDetail = deleteStationDetail;
const getAllStationDetails = (dbModel, query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, stationDetail_model_1.ksStationDetailModel, stationDetail_model_1.csStationDetailModel);
        return yield selectedModel.find(query);
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.getAllStationDetails = getAllStationDetails;
const permissionAddService = (stationId, name, dbModel, pipeLine) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, stationDetail_model_1.ksStationDetailModel, stationDetail_model_1.csStationDetailModel);
        yield selectedModel.findByIdAndUpdate({ _id: stationId }, pipeLine);
        return yield selectedModel.findById({ _id: stationId });
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.permissionAddService = permissionAddService;
