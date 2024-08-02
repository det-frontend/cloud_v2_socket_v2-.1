"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDailyReportByMonth = exports.dailyReportPaginate = exports.getDailyReportByDate = exports.deleteDailyReport = exports.updateDailyReport = exports.addDailyReport = exports.getDailyReport = void 0;
const dailyReport_model_1 = require("../model/dailyReport.model");
const config_1 = __importDefault(require("config"));
const helper_1 = require("../utils/helper");
const limitNo = config_1.default.get("page_limit");
const getDailyReport = async (query, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, dailyReport_model_1.ksDailyReportModel, dailyReport_model_1.csDailyReportModel);
        return await selectedModel
            .find(query)
            .lean()
            .populate("stationId")
            .select("-__v");
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.getDailyReport = getDailyReport;
const addDailyReport = async (body, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, dailyReport_model_1.ksDailyReportModel, dailyReport_model_1.csDailyReportModel);
        if (!body.accessDb)
            body.accessDb = dbModel;
        return await new selectedModel(body).save();
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.addDailyReport = addDailyReport;
const updateDailyReport = async (query, body, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, dailyReport_model_1.ksDailyReportModel, dailyReport_model_1.csDailyReportModel);
        if (!body.accessDb)
            body.accessDb = dbModel;
        await selectedModel.updateMany(query, body);
        return await selectedModel.find(query).lean();
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.updateDailyReport = updateDailyReport;
const deleteDailyReport = async (query, dbModel) => {
    try {
        let selectedModel = (0, helper_1.dBSelector)(dbModel, dailyReport_model_1.ksDailyReportModel, dailyReport_model_1.csDailyReportModel);
        let DailyReport = await selectedModel.find(query);
        if (!DailyReport) {
            throw new Error("No DailyReport with that id");
        }
        return await selectedModel.deleteMany(query);
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.deleteDailyReport = deleteDailyReport;
const getDailyReportByDate = async (query, d1, d2, pageNo, dbModel) => {
    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;
    const filter = {
        ...query,
        date: {
            $gt: d1,
            $lt: d2,
        },
    };
    let selectedModel = (0, helper_1.dBSelector)(dbModel, dailyReport_model_1.ksDailyReportModel, dailyReport_model_1.csDailyReportModel);
    let result = await selectedModel
        .find(filter)
        .sort({ date: -1 })
        .skip(skipCount)
        .limit(limitNo)
        .populate("stationId")
        .select("-__v");
    return result;
};
exports.getDailyReportByDate = getDailyReportByDate;
const dailyReportPaginate = async (pageNo, query, dbModel) => {
    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;
    let selectedModel = (0, helper_1.dBSelector)(dbModel, dailyReport_model_1.ksDailyReportModel, dailyReport_model_1.csDailyReportModel);
    const data = await selectedModel
        .find(query)
        .sort({ date: -1 })
        .skip(skipCount)
        .limit(limitNo)
        .populate("stationId")
        .select("-__v");
    const count = await selectedModel.countDocuments(query);
    return { count, data };
};
exports.dailyReportPaginate = dailyReportPaginate;
const getDailyReportByMonth = async (query, year, month, dbModel) => {
    const startDate = new Date(year, month - 1, 1, 0, 0, 0); // Month is zero-based
    const endDate = new Date(year, month, 1, 0, 0, 0); // Month is zero-based
    const filter = {
        ...query,
        date: {
            $gte: startDate,
            $lt: endDate,
        },
    };
    let selectedModel = (0, helper_1.dBSelector)(dbModel, dailyReport_model_1.ksDailyReportModel, dailyReport_model_1.csDailyReportModel);
    const result = await selectedModel.find(filter).select("-__v");
    return result;
};
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
