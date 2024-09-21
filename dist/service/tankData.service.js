"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.latestTankDataByStationId = exports.updateTankDataService = exports.deleteTankDataById = exports.getAllTankDataService = exports.tankDataByDates = exports.tankDataByDate = exports.updateExistingTankData = exports.addTankDataService = exports.getTankData = void 0;
const tankData_Detail_model_1 = require("../model/tankData.Detail.model");
const helper_1 = require("../utils/helper");
const config_1 = __importDefault(require("config"));
const limitNo = config_1.default.get('page_limit');
const getTankData = async (query, dbModel) => {
    let selectedModel = (0, helper_1.dBSelector)(dbModel, tankData_Detail_model_1.ksTankDataModel, tankData_Detail_model_1.csTankDataModel);
    try {
        return await selectedModel.find(query).lean().select("-__v");
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.getTankData = getTankData;
const addTankDataService = async (body, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, tankData_Detail_model_1.ksTankDataModel, tankData_Detail_model_1.csTankDataModel);
        const tankObject = {
            stationDetailId: body.stationDetailId,
            // vocono: body.vocono,
            nozzleNo: body.nozzleNo,
            data: body.data,
            dailyReportDate: body.dateOfDay,
        };
        const result = await selectedModel.create(tankObject);
        if (!result)
            throw new Error("Tank data save is failed!");
        return result;
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.addTankDataService = addTankDataService;
const updateExistingTankData = async (id, body, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, tankData_Detail_model_1.ksTankDataModel, tankData_Detail_model_1.csTankDataModel);
        const tankObject = {
            stationDetailId: body.stationDetailId,
            // vocono: body.vocono,
            nozzleNo: body.nozzleNo,
            data: body.data,
            dailyReportDate: body.dateOfDay,
        };
        await selectedModel.findOneAndUpdate({ _id: id }, tankObject);
        const result = await selectedModel.find({ _id: id }).lean();
        if (!result)
            throw new Error("Tank data save is failed!");
        return result;
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.updateExistingTankData = updateExistingTankData;
const tankDataByDate = async (query, d1, pageNo, dbModel) => {
    let selectedModel = (0, helper_1.dBSelector)(dbModel, tankData_Detail_model_1.ksTankDataModel, tankData_Detail_model_1.csTankDataModel);
    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;
    const data = await selectedModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skipCount)
        .limit(1)
        .populate({
        path: `stationDetailId`,
        model: (0, helper_1.dbDistribution)({ accessDb: dbModel })
    })
        .select("-__v");
    const count = await selectedModel.countDocuments();
    return { data, count };
};
exports.tankDataByDate = tankDataByDate;
const tankDataByDates = async (query, d1, d2, dbModel) => {
    try {
        const filter = {
            ...query,
            createdAt: {
                $gt: d1,
                $lt: d2,
            },
        };
        let selectedModel = (0, helper_1.dBSelector)(dbModel, tankData_Detail_model_1.ksTankDataModel, tankData_Detail_model_1.csTankDataModel);
        return await selectedModel
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
};
exports.tankDataByDates = tankDataByDates;
const getAllTankDataService = async (dbModel, pageNo) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, tankData_Detail_model_1.ksTankDataModel, tankData_Detail_model_1.csTankDataModel);
        const reqPage = pageNo == 1 ? 0 : pageNo - 1;
        const skipCount = limitNo * reqPage;
        const result = await selectedModel
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
};
exports.getAllTankDataService = getAllTankDataService;
const deleteTankDataById = async (query, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, tankData_Detail_model_1.ksTankDataModel, tankData_Detail_model_1.csTankDataModel);
        let tankData = await selectedModel.find(query);
        if (!tankData)
            throw new Error("No tank data with that id!");
        return await selectedModel.deleteMany(query);
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.deleteTankDataById = deleteTankDataById;
const updateTankDataService = async (query, body, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, tankData_Detail_model_1.ksTankDataModel, tankData_Detail_model_1.csTankDataModel);
        await selectedModel.updateMany(query, body);
        return await selectedModel.find(query).lean();
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.updateTankDataService = updateTankDataService;
const latestTankDataByStationId = async (query, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, tankData_Detail_model_1.ksTankDataModel, tankData_Detail_model_1.csTankDataModel);
        return await selectedModel
            .find(query)
            .sort({ createdAt: -1 })
            .limit(1)
            .lean()
            .select("-__v");
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.latestTankDataByStationId = latestTankDataByStationId;
