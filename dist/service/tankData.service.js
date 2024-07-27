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
exports.latestTankDataByStationId = exports.updateTankDataService = exports.deleteTankDataById = exports.getAllTankDataService = exports.tankDataByDates = exports.tankDataByDate = exports.updateExistingTankData = exports.addTankDataService = exports.getTankData = void 0;
const tankData_Detail_model_1 = require("../model/tankData.Detail.model");
const helper_1 = require("../utils/helper");
const config_1 = __importDefault(require("config"));
const limitNo = config_1.default.get('page_limit');
const getTankData = (query, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    let selectedModel = (0, helper_1.dBSelector)(dbModel, tankData_Detail_model_1.ksTankDataModel, tankData_Detail_model_1.csTankDataModel);
    try {
        return yield selectedModel.find(query).lean().select("-__v");
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.getTankData = getTankData;
const addTankDataService = (body, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, tankData_Detail_model_1.ksTankDataModel, tankData_Detail_model_1.csTankDataModel);
        const tankObject = {
            stationDetailId: body.stationDetailId,
            vocono: body.vocono,
            nozzleNo: body.nozzleNo,
            data: body.data,
            dailyReportDate: body.dateOfDay,
        };
        const result = yield selectedModel.create(tankObject);
        if (!result)
            throw new Error("Tank data save is failed!");
        return result;
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.addTankDataService = addTankDataService;
const updateExistingTankData = (body, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, tankData_Detail_model_1.ksTankDataModel, tankData_Detail_model_1.csTankDataModel);
        const tankObject = {
            stationDetailId: body.stationDetailId,
            vocono: body.vocono,
            nozzleNo: body.nozzleNo,
            data: body.data,
            dailyReportDate: body.dateOfDay,
        };
        yield selectedModel.findOneAndUpdate({ _id: body._id }, tankObject);
        const result = yield selectedModel.find({ _id: body._id }).lean();
        if (!result)
            throw new Error("Tank data save is failed!");
        return result;
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.updateExistingTankData = updateExistingTankData;
const tankDataByDate = (query, d1, pageNo, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    let selectedModel = (0, helper_1.dBSelector)(dbModel, tankData_Detail_model_1.ksTankDataModel, tankData_Detail_model_1.csTankDataModel);
    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;
    const data = yield selectedModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skipCount)
        .limit(1)
        .populate({
        path: `stationDetailId`,
        model: (0, helper_1.dbDistribution)({ accessDb: dbModel })
    })
        .select("-__v");
    const count = yield selectedModel.countDocuments();
    return { data, count };
});
exports.tankDataByDate = tankDataByDate;
const tankDataByDates = (query, d1, d2, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = Object.assign(Object.assign({}, query), { createdAt: {
                $gt: d1,
                $lt: d2,
            } });
        let selectedModel = (0, helper_1.dBSelector)(dbModel, tankData_Detail_model_1.ksTankDataModel, tankData_Detail_model_1.csTankDataModel);
        return yield selectedModel
            .find({ createdAt: {
                $gt: d1,
                $lt: d2,
            } })
            .limit(1)
            .sort({ createdAt: -1 })
            .populate({
            path: `stationDetailId`,
            model: (0, helper_1.dbDistribution)({ accessDb: dbModel })
        })
            .select("-__v");
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.tankDataByDates = tankDataByDates;
const getAllTankDataService = (dbModel, pageNo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, tankData_Detail_model_1.ksTankDataModel, tankData_Detail_model_1.csTankDataModel);
        const reqPage = pageNo == 1 ? 0 : pageNo - 1;
        const skipCount = limitNo * reqPage;
        const result = yield selectedModel
            .find()
            .sort({ createdAt: -1 })
            .skip(skipCount)
            .limit(limitNo);
        if (!result)
            throw new Error("All of tank data can't!");
        return result;
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.getAllTankDataService = getAllTankDataService;
const deleteTankDataById = (query, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, tankData_Detail_model_1.ksTankDataModel, tankData_Detail_model_1.csTankDataModel);
        let tankData = yield selectedModel.find(query);
        if (!tankData)
            throw new Error("No tank data with that id!");
        return yield selectedModel.deleteMany(query);
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.deleteTankDataById = deleteTankDataById;
const updateTankDataService = (query, body, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, tankData_Detail_model_1.ksTankDataModel, tankData_Detail_model_1.csTankDataModel);
        yield selectedModel.updateMany(query, body);
        return yield selectedModel.find(query).lean();
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.updateTankDataService = updateTankDataService;
const latestTankDataByStationId = (query, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, tankData_Detail_model_1.ksTankDataModel, tankData_Detail_model_1.csTankDataModel);
        return yield selectedModel
            .find(query)
            .sort({ createdAt: -1 })
            .limit(1)
            .lean()
            .select("-__v");
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.latestTankDataByStationId = latestTankDataByStationId;
