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
exports.findByIdAndAdjust = exports.findStockBalancePagiByDateService = exports.findByoneAndUpdateMany = exports.findStockBalanceByDateService = exports.addStockBalanceService = void 0;
const stockBalance_model_1 = require("../model/stockBalance.model");
const helper_1 = require("../utils/helper");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const config_1 = __importDefault(require("config"));
const addStockBalanceService = (body, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, stockBalance_model_1.ksStockBalanceModel, stockBalance_model_1.csStockBalanceModel);
        //true
        const previousDate = (0, moment_timezone_1.default)()
            .tz("Asia/Yangon")
            .subtract(1, "day")
            .format("YYYY-MM-DD");
        //for test
        const currentDate = (0, moment_timezone_1.default)().tz("Asia/Yangon").format("YYYY-MM-DD");
        const updateGLPre = yield selectedModel.findOne({
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
});
exports.addStockBalanceService = addStockBalanceService;
const findStockBalanceByDateService = (query, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, stockBalance_model_1.ksStockBalanceModel, stockBalance_model_1.csStockBalanceModel);
        return yield selectedModel
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
});
exports.findStockBalanceByDateService = findStockBalanceByDateService;
const findByoneAndUpdateMany = (query, body, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, stockBalance_model_1.ksStockBalanceModel, stockBalance_model_1.csStockBalanceModel);
        const result = yield selectedModel.find(query);
        body.adjust = result.adjust;
        body.totalGL = result.totalGL;
        return yield selectedModel
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
});
exports.findByoneAndUpdateMany = findByoneAndUpdateMany;
const findStockBalancePagiByDateService = (query, pageNo, d1, d2, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    const limitNo = config_1.default.get("page_limit");
    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;
    const filter = Object.assign(Object.assign({}, query), { updatedAt: {
            $gt: d1,
            $lt: d2,
        } });
    let selectedModel = (0, helper_1.dBSelector)(dbModel, stockBalance_model_1.ksStockBalanceModel, stockBalance_model_1.csStockBalanceModel);
    const data = yield selectedModel
        .find(filter)
        .skip(skipCount)
        .limit(limitNo)
        .populate({
        path: "stationId",
        model: (0, helper_1.dbDistribution)({ accessDb: dbModel }),
    })
        .select("-__v");
    const count = yield selectedModel.countDocuments(filter);
    return { data, count };
});
exports.findStockBalancePagiByDateService = findStockBalancePagiByDateService;
const findByIdAndAdjust = (query, payload, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    let selectedModel = (0, helper_1.dBSelector)(dbModel, stockBalance_model_1.ksStockBalanceModel, stockBalance_model_1.csStockBalanceModel);
    const result = yield selectedModel.findOne(query);
    result.totalGL += Number(payload.adjust);
    result.adjust = payload.adjust;
    return yield selectedModel.updateMany(query, result);
});
exports.findByIdAndAdjust = findByIdAndAdjust;
