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
exports.getDailyReportByDateHandler = exports.deleteDailyReportHandler = exports.updateDailyReportHandler = exports.addDailyReportHandler = exports.getDailyReportHandler = void 0;
const helper_1 = __importDefault(require("../utils/helper"));
const dailyReport_service_1 = require("../service/dailyReport.service");
const detailSale_service_1 = require("../service/detailSale.service");
const getDailyReportHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pageNo = Number(req.params.page);
        let model = req.body.accessDb;
        let { data, count } = yield (0, dailyReport_service_1.dailyReportPaginate)(pageNo, req.query, model);
        const result = yield Promise.all(data.map((ea) => __awaiter(void 0, void 0, void 0, function* () {
            ea["ninety-two"] = yield (0, detailSale_service_1.getDetailSaleByFuelType)(ea["dateOfDay"], "001-Octane Ron(92)", model);
            ea["ninety-five"] = yield (0, detailSale_service_1.getDetailSaleByFuelType)(ea["dateOfDay"], "002-Octane Ron(95)", model);
            ea["HSD"] = yield (0, detailSale_service_1.getDetailSaleByFuelType)(ea["dateOfDay"], "004-Diesel", model);
            ea["PHSD"] = yield (0, detailSale_service_1.getDetailSaleByFuelType)(ea["dateOfDay"], "005-Premium Diesel", model);
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
        })));
        (0, helper_1.default)(res, "DailyReport are here", result, model, count);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.getDailyReportHandler = getDailyReportHandler;
const addDailyReportHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let model = req.body.accessDb;
        let result = yield (0, dailyReport_service_1.addDailyReport)(req.body, model);
        (0, helper_1.default)(res, "New DailyReport data was added", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.addDailyReportHandler = addDailyReportHandler;
const updateDailyReportHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let model = req.body.accessDb;
        // console.log(model)
        let result = yield (0, dailyReport_service_1.updateDailyReport)(req.query, req.body, model);
        (0, helper_1.default)(res, "updated DailyReport data", result);
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.updateDailyReportHandler = updateDailyReportHandler;
const deleteDailyReportHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let model = req.body.accessDb;
        yield (0, dailyReport_service_1.deleteDailyReport)(req.query, model);
        (0, helper_1.default)(res, "DailyReport data was deleted");
    }
    catch (e) {
        next(new Error(e));
    }
});
exports.deleteDailyReportHandler = deleteDailyReportHandler;
const getDailyReportByDateHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        result = yield (0, dailyReport_service_1.getDailyReportByDate)(query, startDate, endDate, pageNo, model);
        const resultWithDetails = yield Promise.all(result.map((ea) => __awaiter(void 0, void 0, void 0, function* () {
            ea["ninety-two"] = yield (0, detailSale_service_1.getDetailSaleByFuelType)(ea["dateOfDay"], "001-Octane Ron(92)", model);
            ea["ninety-five"] = yield (0, detailSale_service_1.getDetailSaleByFuelType)(ea["dateOfDay"], "002-Octane Ron(95)", model);
            ea["HSD"] = yield (0, detailSale_service_1.getDetailSaleByFuelType)(ea["dateOfDay"], "004-Diesel", model);
            ea["PHSD"] = yield (0, detailSale_service_1.getDetailSaleByFuelType)(ea["dateOfDay"], "005-Premium Diesel", model);
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
        })));
        (0, helper_1.default)(res, "between two date", resultWithDetails);
    }
    catch (e) {
        next(new Error(e));
    }
});
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
//   } catch (e) {
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
//   } catch (e) {
//     next(new Error(e));
//   }
// };
