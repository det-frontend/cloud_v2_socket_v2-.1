"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByIdAndAdjust = exports.findStockBalancePagiByDateService = exports.findByoneAndUpdateMany = exports.findStockBalanceByDateService = exports.addStockBalanceService = void 0;
const stockBalance_model_1 = require("../model/stockBalance.model");
const helper_1 = require("../utils/helper");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const config_1 = __importDefault(require("config"));
const addStockBalanceService = async (body, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, stockBalance_model_1.ksStockBalanceModel, stockBalance_model_1.csStockBalanceModel);
        //true
        const previousDate = (0, moment_timezone_1.default)()
            .tz("Asia/Yangon")
            .subtract(1, "day")
            .format("YYYY-MM-DD");
        //for test
        const currentDate = (0, moment_timezone_1.default)().tz("Asia/Yangon").format("YYYY-MM-DD");
        const updateGLPre = await selectedModel.findOne({
            realTime: previousDate,
            tank: body.tank,
        });
        if (updateGLPre !== null) {
            body.totalGL += Number(updateGLPre.todayGL);
        }
        const result = selectedModel.create(body);
        if (!result)
            throw new Error("Stock Balance is failed!");
        return result;
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.addStockBalanceService = addStockBalanceService;
const findStockBalanceByDateService = async (query, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, stockBalance_model_1.ksStockBalanceModel, stockBalance_model_1.csStockBalanceModel);
        return await selectedModel
            .find(query)
            .sort({ createdAt: -1 })
            .populate({
            path: "stationId",
            model: (0, helper_1.dbDistribution)({ accessDb: dbModel }),
        })
            .select("-__v");
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.findStockBalanceByDateService = findStockBalanceByDateService;
const findByoneAndUpdateMany = async (query, body, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, stockBalance_model_1.ksStockBalanceModel, stockBalance_model_1.csStockBalanceModel);
        const result = await selectedModel.find(query);
        body.adjust = result.adjust;
        body.totalGL = result.totalGL;
        return await selectedModel
            .updateMany(query, { $set: body })
            .populate({
            path: "stationId",
            model: (0, helper_1.dbDistribution)({ accessDb: dbModel }),
        })
            .select("-__v");
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.findByoneAndUpdateMany = findByoneAndUpdateMany;
const findStockBalancePagiByDateService = async (query, pageNo, d1, d2, dbModel) => {
    const limitNo = config_1.default.get("page_limit");
    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;
    const filter = {
        ...query,
        updatedAt: {
            $gt: d1,
            $lt: d2,
        },
    };
    let selectedModel = (0, helper_1.dBSelector)(dbModel, stockBalance_model_1.ksStockBalanceModel, stockBalance_model_1.csStockBalanceModel);
    const data = await selectedModel
        .find(filter)
        .skip(skipCount)
        .limit(limitNo)
        .populate({
        path: "stationId",
        model: (0, helper_1.dbDistribution)({ accessDb: dbModel }),
    })
        .select("-__v");
    const count = await selectedModel.countDocuments(filter);
    return { data, count };
};
exports.findStockBalancePagiByDateService = findStockBalancePagiByDateService;
const findByIdAndAdjust = async (query, payload, dbModel) => {
    let selectedModel = (0, helper_1.dBSelector)(dbModel, stockBalance_model_1.ksStockBalanceModel, stockBalance_model_1.csStockBalanceModel);
    const result = await selectedModel.findOne(query);
    result.totalGL += Number(payload.adjust);
    result.adjust = payload.adjust;
    return await selectedModel.updateMany(query, result);
};
exports.findByIdAndAdjust = findByIdAndAdjust;
