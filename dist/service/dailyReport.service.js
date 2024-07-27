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
exports.getDailyReportByMonth = exports.dailyReportPaginate = exports.getDailyReportByDate = exports.deleteDailyReport = exports.updateDailyReport = exports.addDailyReport = exports.getDailyReport = void 0;
const dailyReport_model_1 = require("../model/dailyReport.model");
const config_1 = __importDefault(require("config"));
const helper_1 = require("../utils/helper");
const limitNo = config_1.default.get("page_limit");
const getDailyReport = (query, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, dailyReport_model_1.ksDailyReportModel, dailyReport_model_1.csDailyReportModel);
        return yield selectedModel
            .find(query)
            .lean()
            .populate("stationId")
            .select("-__v");
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.getDailyReport = getDailyReport;
const addDailyReport = (body, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, dailyReport_model_1.ksDailyReportModel, dailyReport_model_1.csDailyReportModel);
        if (!body.accessDb)
            body.accessDb = dbModel;
        return yield new selectedModel(body).save();
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.addDailyReport = addDailyReport;
const updateDailyReport = (query, body, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, dailyReport_model_1.ksDailyReportModel, dailyReport_model_1.csDailyReportModel);
        if (!body.accessDb)
            body.accessDb = dbModel;
        yield selectedModel.updateMany(query, body);
        return yield selectedModel.find(query).lean();
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.updateDailyReport = updateDailyReport;
const deleteDailyReport = (query, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, dailyReport_model_1.ksDailyReportModel, dailyReport_model_1.csDailyReportModel);
        let DailyReport = yield selectedModel.find(query);
        if (!DailyReport) {
            throw new Error("No DailyReport with that id");
        }
        return yield selectedModel.deleteMany(query);
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.deleteDailyReport = deleteDailyReport;
const getDailyReportByDate = (query, d1, d2, pageNo, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;
    const filter = Object.assign(Object.assign({}, query), { date: {
            $gt: d1,
            $lt: d2,
        } });
    let selectedModel = (0, helper_1.dBSelector)(dbModel, dailyReport_model_1.ksDailyReportModel, dailyReport_model_1.csDailyReportModel);
    let result = yield selectedModel
        .find(filter)
        .sort({ date: -1 })
        .skip(skipCount)
        .limit(limitNo)
        .populate("stationId")
        .select("-__v");
    return result;
});
exports.getDailyReportByDate = getDailyReportByDate;
const dailyReportPaginate = (pageNo, query, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;
    let selectedModel = (0, helper_1.dBSelector)(dbModel, dailyReport_model_1.ksDailyReportModel, dailyReport_model_1.csDailyReportModel);
    const data = yield selectedModel
        .find(query)
        .sort({ date: -1 })
        .skip(skipCount)
        .limit(limitNo)
        .populate("stationId")
        .select("-__v");
    const count = yield selectedModel.countDocuments(query);
    return { count, data };
});
exports.dailyReportPaginate = dailyReportPaginate;
const getDailyReportByMonth = (query, year, month, dbModel) => __awaiter(void 0, void 0, void 0, function* () {
    const startDate = new Date(year, month - 1, 1, 0, 0, 0); // Month is zero-based
    const endDate = new Date(year, month, 1, 0, 0, 0); // Month is zero-based
    const filter = Object.assign(Object.assign({}, query), { date: {
            $gte: startDate,
            $lt: endDate,
        } });
    let selectedModel = (0, helper_1.dBSelector)(dbModel, dailyReport_model_1.ksDailyReportModel, dailyReport_model_1.csDailyReportModel);
    const result = yield selectedModel.find(filter).select("-__v");
    return result;
});
exports.getDailyReportByMonth = getDailyReportByMonth;
// export const getDailyReportDateForEachDayService = async (
//  query: FilterQuery<dailyReportDocument>,
//   d1: Date,
//   d2: Date,
//   pageNo: number,
//   dbModel: string
// )=>{
//  const filter: FilterQuery<dailyReportDocument> =  { createAt: { $gt: d1, $lt: d2 }, stationDetailId: query.stationDetailId }
//  let selectedModel = dBSelector(
//     dbModel,
//     ksDetailSaleModel,
//     csDetailSaleModel
//  );
//   console.log(filter)
//   return await selectedModel.aggregate([
//     {
//       $match: filter
//     },
//     {
//       $group: {
//         _id: "$dailyReportDate",
//         totalSaleLiter: {
//           $sum: "$saleLiter"
//         },
//         totalPrice: {
//           $sum: "$totalPrice"
//         }
//       }
//     }
//   ]);
// };
