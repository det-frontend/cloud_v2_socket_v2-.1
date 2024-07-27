"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDailyReportByDateHandler = exports.deleteDailyReportHandler = exports.updateDailyReportHandler = exports.addDailyReportHandler = exports.getDailyReportHandler = void 0;
const helper_1 = __importDefault(require("../utils/helper"));
const dailyReport_service_1 = require("../service/dailyReport.service");
const detailSale_service_1 = require("../service/detailSale.service");
const getDailyReportHandler = async (req, res, next) => {
    try {
        let pageNo = Number(req.params.page);
        let model = req.body.accessDb;
        let { data, count } = await (0, dailyReport_service_1.dailyReportPaginate)(pageNo, req.query, model);
        const result = await Promise.all(data.map(async (ea) => {
            ea["ninety-two"] = await (0, detailSale_service_1.getDetailSaleByFuelType)(ea["dateOfDay"], "001-Octane Ron(92)", model);
            ea["ninety-five"] = await (0, detailSale_service_1.getDetailSaleByFuelType)(ea["dateOfDay"], "002-Octane Ron(95)", model);
            ea["HSD"] = await (0, detailSale_service_1.getDetailSaleByFuelType)(ea["dateOfDay"], "004-Diesel", model);
            ea["PHSD"] = await (0, detailSale_service_1.getDetailSaleByFuelType)(ea["dateOfDay"], "005-Premium Diesel", model);
            return {
                _id: ea["_id"],
                stationId: ea["stationId"],
                dateOfDay: ea["dateOfDay"],
                date: ea["date"],
                prices: ea["prices"],
                "ninety-two": ea["ninety-two"],
                "ninety-five": ea["ninety-five"],
                HSD: ea["HSD"],
                PHSD: ea["PHSD"],
            };
        }));
        (0, helper_1.default)(res, "DailyReport are here", result, model, count);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.getDailyReportHandler = getDailyReportHandler;
const addDailyReportHandler = async (req, res, next) => {
    try {
        let model = req.body.accessDb;
        let result = await (0, dailyReport_service_1.addDailyReport)(req.body, model);
        (0, helper_1.default)(res, "New DailyReport data was added", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.addDailyReportHandler = addDailyReportHandler;
const updateDailyReportHandler = async (req, res, next) => {
    try {
        let model = req.body.accessDb;
        // console.log(model)
        let result = await (0, dailyReport_service_1.updateDailyReport)(req.query, req.body, model);
        (0, helper_1.default)(res, "updated DailyReport data", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.updateDailyReportHandler = updateDailyReportHandler;
const deleteDailyReportHandler = async (req, res, next) => {
    try {
        let model = req.body.accessDb;
        await (0, dailyReport_service_1.deleteDailyReport)(req.query, model);
        (0, helper_1.default)(res, "DailyReport data was deleted");
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.deleteDailyReportHandler = deleteDailyReportHandler;
const getDailyReportByDateHandler = async (req, res, next) => {
    try {
        let sDate = req.query.sDate;
        let eDate = req.query.eDate;
        let pageNo = Number(req.params.page);
        delete req.query.sDate;
        delete req.query.eDate;
        let query = req.query;
        let model = req.body.accessDb;
        let result;
        if (!sDate) {
            throw new Error("you need date");
        }
        if (!eDate) {
            eDate = new Date();
        }
        //if date error ? you should use split with T or be sure detail Id
        const startDate = new Date(sDate);
        const endDate = new Date(eDate);
        result = await (0, dailyReport_service_1.getDailyReportByDate)(query, startDate, endDate, pageNo, model);
        const resultWithDetails = await Promise.all(result.map(async (ea) => {
            ea["ninety-two"] = await (0, detailSale_service_1.getDetailSaleByFuelType)(ea["dateOfDay"], "001-Octane Ron(92)", model);
            ea["ninety-five"] = await (0, detailSale_service_1.getDetailSaleByFuelType)(ea["dateOfDay"], "002-Octane Ron(95)", model);
            ea["HSD"] = await (0, detailSale_service_1.getDetailSaleByFuelType)(ea["dateOfDay"], "004-Diesel", model);
            ea["PHSD"] = await (0, detailSale_service_1.getDetailSaleByFuelType)(ea["dateOfDay"], "005-Premium Diesel", model);
            return {
                _id: ea["_id"],
                stationId: ea["stationId"],
                dateOfDay: ea["dateOfDay"],
                date: ea["date"],
                prices: ea["prices"],
                "ninety-two": ea["ninety-two"],
                "ninety-five": ea["ninety-five"],
                HSD: ea["HSD"],
                PHSD: ea["PHSD"],
            };
        }));
        (0, helper_1.default)(res, "between two date", resultWithDetails);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.getDailyReportByDateHandler = getDailyReportByDateHandler;
// export const getDailyReportDateForEachDayHandler = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     let sDate: any = req.query.sDate;
//     let eDate: any = req.query.eDate;
//     let pageNo: number = Number(req.params.page);
//     delete req.query.sDate;
//     delete req.query.eDate;
//     let query = req.query;
//     if (!req.query.stationDetailId) throw new Error("you need stataion");
//     if (!sDate) throw new Error("you need date");
//     if (!eDate) eDate = new Date();
//     const startDate: Date = new Date(sDate);
//     const endDate: Date = new Date(eDate);
//     let model = req.body.accessDb;
//     let result = await getDailyReportDateForEachDayService(query, startDate, endDate, pageNo, model);
//     console.log(result)
//     fMsg(res, 'Daily Report Date For EachDay', result);
//   } catch (e: any) {
//     next(new Error(e))
//   }
// };
// export const getDailyReportByMonthHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     let year = req.query.year;
//     let month = req.query.month;
//     // delete req.query.year;
//     // delete req.query.month;
//     // if (!year || !month) {
//     //   next(new Error("you need month or date wk"));
//     // }
//     // if (typeof year != "number" || typeof month != "number")
//     //   return next(new Error("you need month or date"));
//     let result =await getDailyReportByMonth(req.query, 2023, 5);
//     fMsg(res , 'wk' , result)
//   } catch (e: any) {
//     next(new Error(e));
//   }
// };
