"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDailyReportDateForEachDayHandler = exports.calcualteDatasForEachDayHanlder = exports.sevenDayPreviousTotalHandler = exports.calculateStationTotalHandler = exports.calculateCategoriesTotalHandler = exports.calculateTotalPerDayHandler = exports.statementReportHandler = exports.getDetailSaleDatePagiHandler = exports.getDetailSaleByDateHandler = exports.deleteDetailSaleHandler = exports.updateDetailSaleHandler = exports.addDetailSaleHandler = exports.getDetailSaleHandler = void 0;
const helper_1 = __importStar(require("../utils/helper"));
const detailSale_service_1 = require("../service/detailSale.service");
const fuelBalance_service_1 = require("../service/fuelBalance.service");
const dailyReport_service_1 = require("../service/dailyReport.service");
const stationDetail_service_1 = require("../service/stationDetail.service");
const mongodb_1 = require("mongodb");
const collection_service_1 = require("../service/collection.service");
const logger_1 = __importDefault(require("../utils/logger"));
const getDetailSaleHandler = async (req, res, next) => {
    try {
        let pageNo = Number(req.params.page);
        if (!pageNo)
            throw new Error("You need page number");
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        let { data, count } = await (0, detailSale_service_1.detailSalePaginate)(pageNo, req.query, model);
        (0, helper_1.default)(res, "DetailSale are here", data, model, count);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.getDetailSaleHandler = getDetailSaleHandler;
const addDetailSaleHandler = async (req, res, next) => {
    const start = Date.now();
    logger_1.default.warn(`
  ========== start ==========
  Function: addDetailSaleHandler
  Request Date: ${start}
  Request Method: ${req.method}
  Request URL: ${req.originalUrl}
  Request Body: ${JSON.stringify(req.body)}
  ========== ended ==========
  `, { file: 'detailsale.log' });
    try {
        // //that is remove after pos updated
        let model = req.body.accessDb;
        // console.log(req.body, "this is req.body");
        let check = await (0, detailSale_service_1.getDetailSale)({ vocono: req.body.vocono }, model);
        //console.log(check);
        if (check.length != 0) {
            (0, helper_1.default)(res);
            return;
        }
        let result = await (0, detailSale_service_1.addDetailSale)(req.body, model);
        let checkDate = await (0, fuelBalance_service_1.getFuelBalance)({
            stationId: result.stationDetailId,
            createAt: result.dailyReportDate,
        }, model);
        let checkRpDate = await (0, dailyReport_service_1.getDailyReport)({
            stationId: result.stationDetailId,
            dateOfDay: result.dailyReportDate,
        }, model);
        if (checkRpDate.length == 0) {
            await (0, dailyReport_service_1.addDailyReport)({
                stationId: result.stationDetailId,
                dateOfDay: result.dailyReportDate,
            }, model);
        }
        let station = await (0, stationDetail_service_1.getStationDetail)({
            _id: result.stationDetailId,
        }, model);
        // console.log('station', station);
        const tankCount = station[0].tankCount;
        if (checkDate.length == 0) {
            let prevDate = (0, helper_1.previous)(new Date(req.body.dailyReportDate));
            let prevResult = await (0, fuelBalance_service_1.getFuelBalance)({
                stationId: result.stationDetailId,
                // createAt: prevDate,
            }, model, tankCount);
            // get tank count from stationDetail
            // console.log('tankCount', tankCount);
            //.slice(0, 4)
            await Promise.all(prevResult?.map(async (ea) => {
                let obj;
                if (ea.balance == 0) {
                    obj = {
                        stationId: ea.stationId,
                        fuelType: ea.fuelType,
                        capacity: ea.capacity,
                        opening: ea.opening + ea.fuelIn,
                        tankNo: ea.tankNo,
                        createAt: result.dailyReportDate,
                        nozzles: ea.nozzles,
                        balance: ea.opening + ea.fuelIn,
                    };
                }
                else {
                    obj = {
                        stationId: ea.stationId,
                        fuelType: ea.fuelType,
                        capacity: ea.capacity,
                        opening: ea.opening + ea.fuelIn - ea.cash,
                        tankNo: ea.tankNo,
                        createAt: req.body.dailyReportDate,
                        nozzles: ea.nozzles,
                        balance: ea.opening + ea.fuelIn - ea.cash,
                    };
                }
                await (0, fuelBalance_service_1.addFuelBalance)(obj, model);
            }));
        }
        await (0, fuelBalance_service_1.calcFuelBalance)({
            stationId: result.stationDetailId,
            fuelType: result.fuelType,
            createAt: result.dailyReportDate,
        }, { liter: result.saleLiter }, result.nozzleNo, model);
        (0, helper_1.default)(res, "New DetailSale data was added", result);
    }
    catch (e) {
        logger_1.default.error(`
    ========== start ==========
    Function: addDetailSaleHandler
    Error: ${e.message}
    Stack: ${e.stack}
    ========== ended ==========
    `, { file: 'detailsale.log' });
        next(new Error(e));
    }
    finally {
        const duration = Date.now() - start;
        logger_1.default.info(`
    ========== start ==========
    Function: addDetailSaleHandler
    Duration: ${duration}ms
    ========== ended ==========
    `, { file: 'detailsale.log' });
    }
};
exports.addDetailSaleHandler = addDetailSaleHandler;
const updateDetailSaleHandler = async (req, res, next) => {
    try {
        let model = req.body.accessDb;
        let result = await (0, detailSale_service_1.updateDetailSale)(req.query, req.body, model);
        (0, helper_1.default)(res, "updated DetailSale data", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.updateDetailSaleHandler = updateDetailSaleHandler;
const deleteDetailSaleHandler = async (req, res, next) => {
    try {
        let model = req.body.accessDb;
        await (0, detailSale_service_1.deleteDetailSale)(req.query, model);
        (0, helper_1.default)(res, "DetailSale data was deleted");
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.deleteDetailSaleHandler = deleteDetailSaleHandler;
// //get detail sale between two date
const getDetailSaleByDateHandler = async (req, res, next) => {
    try {
        let sDate = req.query.sDate;
        let eDate = req.query.eDate;
        delete req.query.sDate;
        delete req.query.eDate;
        delete req.query.greater;
        delete req.query.amount;
        let query = req.query;
        if (!sDate) {
            throw new Error("you need date");
        }
        if (!eDate) {
            eDate = new Date();
        }
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        //if date error ? you should use split with T or be sure detail Id
        const startDate = new Date(sDate);
        const endDate = new Date(eDate);
        let result = await (0, detailSale_service_1.detailSaleByDate)(query, startDate, endDate, model);
        (0, helper_1.default)(res, "detail sale between two date", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.getDetailSaleByDateHandler = getDetailSaleByDateHandler;
const getDetailSaleDatePagiHandler = async (req, res, next) => {
    try {
        let sDate = req.query.sDate;
        let eDate = req.query.eDate;
        let pageNo = Number(req.params.page);
        const greater = req.query.greate;
        const amount = parseInt(req.query.amount);
        const kyat = req.query.kyat;
        delete req.query.sDate;
        delete req.query.eDate;
        delete req.query.greate;
        delete req.query.amount;
        delete req.query.kyat;
        let query = req.query;
        if (!sDate) {
            throw new Error("you need date");
        }
        if (!eDate) {
            eDate = new Date();
        }
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        //if date error ? you should use split with T or be sure detail Id
        const startDate = new Date(sDate);
        const endDate = new Date(eDate);
        let { data, count } = await (0, detailSale_service_1.detailSaleByDateAndPagi)(query, startDate, endDate, pageNo, greater, amount, kyat, model);
        (0, helper_1.default)(res, "detail sale between two date", data, model, count);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.getDetailSaleDatePagiHandler = getDetailSaleDatePagiHandler;
//old version
// export const statementReportHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     let sDate: any = req.query.sDate;
//     let eDate: any = req.query.eDate;
//     delete req.query.sDate;
//     delete req.query.eDate;
//     let query = req.query;
//     if (!req.query.stationDetailId) throw new Error("you need stataion");
//     if (!sDate) throw new Error("you need date");
//     if (!eDate) eDate = new Date();
//     const startDate: Date = new Date(sDate);
//     const endDate: Date = new Date(eDate);
//     let model: any;
//     if (req.query.accessDb) {
//       model = req.query.accessDb;
//     } else {
//       model = req.body.accessDb;
//     }
//     let stationDetail = await getStationDetail(
//       {
//         _id: req.query.stationDetailId,
//       },
//       model
//     );
//     let finalData: any = [];
//     for (let i: number = 1; i <= stationDetail[0].nozzleCount; i++) {
//       let noz = i.toString().padStart(2, "0");
//       query = {
//         ...query,
//         nozzleNo: noz,
//       };
//       // let result = await detailSaleByDate(query, startDate, endDate, model);
//       const value = await detailSaleByDate(query, startDate, endDate, model);
//       let result = value.reverse();
//       let count = result.length;
//       if (count == 0) {
//         query = {
//           ...query,
//           nozzleNo: noz,
//         };
//         let lastData = await getLastDetailSale(query, model);
//         // console.log(
//         //   lastData,
//         //   "this is last Data....................................................."
//         // );
//         if (lastData) {
//           let data = {
//             stationId: stationDetail[0].name,
//             station: stationDetail,
//             nozzle: noz,
//             price: "0",
//             fuelType: lastData?.fuelType,
//             totalizer_opening: lastData?.devTotalizar_liter,
//             totalizer_closing: lastData?.devTotalizar_liter,
//             totalizer_different: 0,
//             totalSaleLiter: 0,
//             totalSalePrice: 0,
//             other: 0,
//             pumptest: 0,
//           };
//           finalData.push(data);
//         } else {
//           let data = {
//             stationId: stationDetail[0].name,
//             station: stationDetail,
//             nozzle: noz,
//             price: "0",
//             fuelType: "-",
//             totalizer_opening: "0",
//             totalizer_closing: "0",
//             totalizer_different: 0,
//             totalSaleLiter: 0,
//             totalSalePrice: 0,
//             other: 0,
//             pumptest: 0,
//           };
//           finalData.push(data);
//         }
//         // return;
//       } else {
//         let totalSaleLiter: number = result
//           .map((ea) => ea["saleLiter"])
//           .reduce((pv: number, cv: number): number => pv + cv, 0);
//         let totalSalePrice: number = result
//           .map((ea) => ea["totalPrice"])
//           .reduce((pv: number, cv: number): number => pv + cv, 0);
//         let pumptest: number = result
//           .filter((ea) => ea.vehicleType == "Pump Test")
//           .map((ea) => ea.totalPrice)
//           .reduce((pv: number, cv: number): number => pv + cv, 0);
//         // console.log(
//         //   result[0].devTotalizar_liter,
//         //   result[count - 1].devTotalizar_liter,
//         //   result[count - 1].salePrice
//         // );
//         let otherCalcu =
//           (
//             Number(
//               result[count - 1].devTotalizar_liter -
//                 (result[0].devTotalizar_liter - result[0].saleLiter)
//             ) - Number(totalSaleLiter - pumptest)
//           ).toFixed(3) || "0";
//         let data = {
//           stationId: stationDetail[0].name,
//           station: stationDetail,
//           nozzle: noz,
//           fuelType: result[count - 1].fuelType,
//           price: result[count - 1].salePrice
//             ? result[count - 1].salePrice
//             : result[count - 2].salePrice,
//           totalizer_opening: Number(
//             (result[0].devTotalizar_liter - result[0].saleLiter).toFixed(3)
//           ),
//           totalizer_closing: Number(
//             result[count - 1].devTotalizar_liter.toFixed(3)
//           ),
//           totalizer_different: Number(
//             result[count - 1].devTotalizar_liter -
//               (result[0].devTotalizar_liter - result[0].saleLiter)
//           ).toFixed(3),
//           totalSaleLiter: Number((totalSaleLiter - pumptest).toFixed(3)),
//           totalSalePrice: Number(totalSalePrice.toFixed(3)),
//           other: Math.abs(
//             Number(
//               result[count - 1].devTotalizar_liter -
//                 (result[0].devTotalizar_liter - result[0].saleLiter)
//             ) - Number((totalSaleLiter - pumptest).toFixed(3))
//           ),
//           pumptest: pumptest,
//         };
//         finalData.push(data);
//       }
//     }
//     // console.log("0000000000");
//     // console.log(finalData);
//     // console.log("0000000000");
//     fMsg(res, "final data", finalData, model);
//   } catch (e) {
//     console.log(e);
//     next(new Error(e));
//   }
// };
//new version
// export const statementReportHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const sDate: any = req.query.sDate;
//     const eDate: any = req.query.eDate;
//     delete req.query.sDate;
//     delete req.query.eDate;
//     if (!req.query.stationDetailId) throw new Error("You need stationDetailId");
//     if (!sDate) throw new Error("You need start date");
//     const startDate: Date = new Date(sDate);
//     const endDate: Date = eDate ? new Date(eDate) : new Date();
//     const model: any = req.query.accessDb || req.body.accessDb;
//     const stationDetail = await getStationDetail(
//       {
//         _id: req.query.stationDetailId,
//       },
//       model
//     );
//     const finalData: { [date: string]: any[] } = {};
//     for (let i: number = 1; i <= stationDetail[0].nozzleCount; i++) {
//       const noz = i.toString().padStart(2, "0");
//       let query = {
//         ...req.query,
//         nozzleNo: noz,
//       };
//       const value = await detailSaleByDate(query, startDate, endDate, model);
//       const result = value.reverse();
//       // Organize data by date
//       const dateGroupedData: { [date: string]: any[] } = {};
//       for (const entry of result) {
//         const entryDate = new Date(entry.dailyReportDate).toISOString().split("T")[0]; // Extract date part (YYYY-MM-DD)
//         if (!dateGroupedData[entryDate]) {
//           dateGroupedData[entryDate] = [];
//         }
//         let data = {
//           stationId: stationDetail[0].name,
//           station: stationDetail,
//           nozzle: noz,
//           fuelType: entry.fuelType,
//           price: entry.salePrice,
//           totalizer_opening: entry.devTotalizar_liter - entry.saleLiter,
//           totalizer_closing: entry.devTotalizar_liter,
//           totalizer_different:
//             entry.devTotalizar_liter -
//             (entry.devTotalizar_liter - entry.saleLiter),
//           totalSaleLiter: entry.saleLiter,
//           totalSalePrice: entry.totalPrice,
//           // other: entry.other,
//           pumptest: entry.vehicleType === "Pump Test" ? entry.totalPrice : 0,
//         };
//         dateGroupedData[entryDate].push(data);
//       }
//       // Fill in data for dates with no transactions
//       for (const date in dateGroupedData) {
//         let totalSaleLiter = dateGroupedData[date].reduce(
//           (acc, item) => acc + item.totalSaleLiter,
//           0
//         );
//         let totalSalePrice = dateGroupedData[date].reduce(
//           (acc, item) => acc + item.totalSalePrice,
//           0
//         );
//         let pumptest = dateGroupedData[date].reduce(
//           (acc, item) => acc + item.pumptest,
//           0
//         );
//         finalData[date] = finalData[date] || [];
//         finalData[date].push({
//           stationId: stationDetail[0].name,
//           station: stationDetail,
//           nozzle: noz,
//           fuelType: dateGroupedData[date][0]?.fuelType || "-",
//           price: dateGroupedData[date][0]?.price || "0",
//           totalizer_opening: dateGroupedData[date][0]?.totalizer_opening || "0",
//           totalizer_closing: dateGroupedData[date][0]?.totalizer_closing || "0",
//           totalizer_different:
//             dateGroupedData[date][0]?.totalizer_closing -
//               dateGroupedData[date][0]?.totalizer_opening || "0",
//           totalSaleLiter: totalSaleLiter.toFixed(3),
//           totalSalePrice: totalSalePrice.toFixed(3),
//           other: 0, // Compute this if needed based on your logic
//           pumptest: pumptest.toFixed(3),
//         });
//       }
//     }
//     fMsg(res, "Final data by date", finalData, model);
//   } catch (e) {
//     console.log(e);
//     next(new Error(e));
//   }
// };
const statementReportHandler = async (req, res, next) => {
    try {
        const sDate = req.query.sDate;
        const eDate = req.query.eDate;
        delete req.query.sDate;
        delete req.query.eDate;
        if (!req.query.stationDetailId)
            throw new Error("You need stationDetailId");
        if (!sDate)
            throw new Error("You need start date");
        const startDate = new Date(sDate);
        const endDate = eDate ? new Date(eDate) : new Date();
        const model = req.query.accessDb || req.body.accessDb;
        const stationDetail = await (0, stationDetail_service_1.getStationDetail)({
            _id: req.query.stationDetailId,
        }, model);
        const nozzleCount = stationDetail[0].nozzleCount;
        const finalData = []; // Array to store final results
        for (let i = 1; i <= nozzleCount; i++) {
            const noz = i.toString().padStart(2, "0");
            let query = {
                ...req.query,
                nozzleNo: noz,
            };
            const value = await (0, detailSale_service_1.detailSaleByDate)(query, startDate, endDate, model);
            const result = value.reverse();
            // Organize data by date and include date in each entry
            const dateGroupedData = {};
            let count = result.length;
            if (count == 0) {
                query = {
                    ...query,
                    nozzleNo: noz,
                };
                let lastData = await (0, detailSale_service_1.getLastDetailSale)(query, model);
                // console.log(
                //   lastData,
                //   "this is last Data....................................................."
                // );
                if (lastData) {
                    let data = {
                        date: "-",
                        stationId: stationDetail[0].name,
                        station: stationDetail,
                        nozzle: noz,
                        price: "0",
                        fuelType: lastData?.fuelType,
                        totalizer_opening: lastData?.devTotalizar_liter,
                        totalizer_closing: lastData?.devTotalizar_liter,
                        totalizer_different: 0,
                        totalSaleLiter: 0,
                        totalSalePrice: 0,
                        other: 0,
                        pumptest: 0,
                    };
                    finalData.push(data);
                }
                else {
                    let data = {
                        date: "-",
                        stationId: stationDetail[0].name,
                        station: stationDetail,
                        nozzle: noz,
                        price: "0",
                        fuelType: "-",
                        totalizer_opening: "0",
                        totalizer_closing: "0",
                        totalizer_different: 0,
                        totalSaleLiter: 0,
                        totalSalePrice: 0,
                        other: 0,
                        pumptest: 0,
                    };
                    finalData.push(data);
                }
            }
            else {
                for (const entry of result) {
                    const entryDate = new Date(entry.dailyReportDate)
                        .toISOString()
                        .split("T")[0]; // Extract date part (YYYY-MM-DD)
                    if (!dateGroupedData[entryDate]) {
                        dateGroupedData[entryDate] = [];
                    }
                    let totalSaleLiter = result
                        .map((ea) => ea["saleLiter"])
                        .reduce((pv, cv) => pv + cv, 0);
                    let pumptest = result
                        .filter((ea) => ea.vehicleType == "Pump Test")
                        .map((ea) => ea.totalPrice)
                        .reduce((pv, cv) => pv + cv, 0);
                    let data = {
                        date: entryDate,
                        stationId: stationDetail[0].name,
                        station: stationDetail,
                        nozzle: noz,
                        fuelType: entry.fuelType,
                        price: entry.salePrice,
                        totalizer_opening: entry.devTotalizar_liter - entry.saleLiter,
                        totalizer_closing: entry.devTotalizar_liter,
                        totalizer_different: entry.devTotalizar_liter -
                            (entry.devTotalizar_liter - entry.saleLiter),
                        totalSaleLiter: entry.saleLiter,
                        totalSalePrice: entry.totalPrice,
                        pumptest: entry.vehicleType === "Pump Test" ? entry.saleLiter : 0,
                    };
                    dateGroupedData[entryDate].push(data);
                }
            }
            // Fill in data for dates with no transactions
            for (const date in dateGroupedData) {
                let totalSaleLiter = dateGroupedData[date].reduce((acc, item) => acc + item.totalSaleLiter, 0);
                let totalSalePrice = dateGroupedData[date].reduce((acc, item) => acc + item.totalSalePrice, 0);
                let pumptest = dateGroupedData[date].reduce((acc, item) => acc + item.pumptest, 0);
                finalData.push({
                    date,
                    stationId: stationDetail[0].name,
                    station: stationDetail,
                    nozzle: noz,
                    fuelType: dateGroupedData[date][0]?.fuelType || "-",
                    price: dateGroupedData[date][0]?.price || "0",
                    totalizer_opening: dateGroupedData[date][0]?.totalizer_opening || "0",
                    totalizer_closing: dateGroupedData[date][dateGroupedData[date].length - 1]
                        ?.totalizer_closing || "0",
                    totalizer_different: dateGroupedData[date][dateGroupedData[date].length - 1]
                        ?.totalizer_closing -
                        dateGroupedData[date][0]?.totalizer_opening || "0",
                    totalSaleLiter: (totalSaleLiter - pumptest).toFixed(3),
                    totalSalePrice: totalSalePrice.toFixed(3),
                    // other: dateGroupedData[date][0]?.other,
                    // Compute this if needed based on your logic
                    pumptest: pumptest.toFixed(3),
                    other: Math.abs(Number(dateGroupedData[date][dateGroupedData[date].length - 1]
                        ?.totalizer_closing -
                        dateGroupedData[date][0]?.totalizer_opening) - Number(totalSaleLiter.toFixed(3))),
                });
            }
        }
        (0, helper_1.default)(res, "Final data by date", finalData, model);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.statementReportHandler = statementReportHandler;
//.........
const calculateTotalPerDayHandler = async (req, res, next) => {
    try {
        let sDate = req.query.sDate;
        let eDate = req.query.eDate;
        delete req.query.sDate;
        delete req.query.eDate;
        if (!sDate)
            throw new Error("you need date");
        if (!eDate)
            eDate = new Date();
        const startDate = new Date(sDate);
        const endDate = new Date(eDate);
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        if (req.query.totalVehicle) {
            const vehicleQuery = { createAt: { $gt: startDate, $lt: endDate } };
            const result = await (0, detailSale_service_1.getTodayVechicleCount)(vehicleQuery, model);
            if (result)
                (0, helper_1.default)(res, "Total Vehicle", result, model);
        }
        else if (req.query.fuelType) {
            const vehicleQuery = {
                createAt: { $gt: startDate, $lt: endDate },
                fuelType: req.query.fuelType,
            };
            const result = await (0, detailSale_service_1.sumTodayDatasService)(vehicleQuery, model);
            if (result)
                (0, helper_1.default)(res, `Total FuelType ${req.query.fuelType}`, result, model);
        }
        else {
            const vehicleQuery = { createAt: { $gt: startDate, $lt: endDate } };
            const result = await (0, detailSale_service_1.sumTodayDatasService)(vehicleQuery, model);
            if (result)
                (0, helper_1.default)(res, "Total Today Sum", result, model);
        }
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.calculateTotalPerDayHandler = calculateTotalPerDayHandler;
const calculateCategoriesTotalHandler = async (req, res, next) => {
    try {
        let sDate = req.query.sDate;
        let eDate = req.query.eDate;
        delete req.query.sDate;
        delete req.query.eDate;
        if (!sDate)
            throw new Error("you need date");
        if (!eDate)
            eDate = new Date();
        const startDate = new Date(sDate);
        const endDate = new Date(eDate);
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        let vehicleTypes = req.query.vehicleType;
        vehicleTypes = vehicleTypes.split(",");
        const vehicleQuery = {
            createAt: { $gt: startDate, $lt: endDate },
            vehicleType: { $in: vehicleTypes },
        };
        const result = await (0, detailSale_service_1.sumTodayCategoryDatasService)(vehicleQuery, model);
        if (result)
            (0, helper_1.default)(res, "Total Vehicle", result, model);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.calculateCategoriesTotalHandler = calculateCategoriesTotalHandler;
const calculateStationTotalHandler = async (req, res, next) => {
    try {
        let sDate = req.query.sDate;
        let eDate = req.query.eDate;
        delete req.query.sDate;
        delete req.query.eDate;
        if (!sDate)
            throw new Error("you need date");
        if (!eDate)
            eDate = new Date();
        const startDate = new Date(sDate);
        const endDate = new Date(eDate);
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        const collection = await (0, collection_service_1.collectionGet)({ collectionName: model });
        let stationIds = req.query.stations;
        const stationCollection = collection[0].stationCollection;
        const arryStationCollection = [];
        stationCollection.map((e) => {
            return arryStationCollection.push(new mongodb_1.ObjectId(e.stationId));
        });
        // stationIds = stationIds.split(',');
        // const stationDetailIds = [
        //   new ObjectId(stationIds[0]),
        //   new ObjectId(stationIds[1]),
        //   new ObjectId(stationIds[2]),
        //   new ObjectId(stationIds[3]),
        //   new ObjectId(stationIds[4]),
        //   new ObjectId(stationIds[5]),
        // ];
        const vehicleQuery = {
            createAt: { $gt: startDate, $lt: endDate },
            stationDetailId: { $in: arryStationCollection },
        };
        const result = await (0, detailSale_service_1.sumTodayStationDatasService)(vehicleQuery, model);
        if (result)
            (0, helper_1.default)(res, "Total Stations", result, model);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.calculateStationTotalHandler = calculateStationTotalHandler;
const sevenDayPreviousTotalHandler = async (req, res, next) => {
    try {
        let model;
        if (req.query.accessDb) {
            model = req.query.accessDb;
        }
        else {
            model = req.body.accessDb;
        }
        function formatDate(date) {
            const year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            if (month < 10) {
                month = "0" + month;
            }
            if (day < 10) {
                day = "0" + day;
            }
            return `${year}-${month}-${day}`;
        }
        function getDates(startDate, endDate) {
            const dates = [];
            let currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                dates.push(formatDate(new Date(currentDate)));
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return dates;
        }
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        const datesArray = getDates(sevenDaysAgo, today);
        const query = { dailyReportDate: { $in: datesArray } };
        const result = await (0, detailSale_service_1.sumTodayDatasService)(query, model);
        if (result)
            (0, helper_1.default)(res, "Total seven day", result, model);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.sevenDayPreviousTotalHandler = sevenDayPreviousTotalHandler;
const calcualteDatasForEachDayHanlder = async (req, res, next) => { };
exports.calcualteDatasForEachDayHanlder = calcualteDatasForEachDayHanlder;
const getDailyReportDateForEachDayHandler = async (req, res, next) => {
    try {
        let sDate = req.query.sDate;
        let eDate = req.query.eDate;
        delete req.query.sDate;
        delete req.query.eDate;
        if (!sDate)
            throw new Error("you need date");
        if (!eDate)
            eDate = new Date();
        const startDate = new Date(sDate);
        const endDate = new Date(eDate);
        let pageNo = Number(req.params.page);
        let model = req.body.accessDb;
        const vehicleQuery = {
            createAt: { $gt: startDate, $lt: endDate },
            stationDetailId: new mongodb_1.ObjectId(`${req.query.stationDetailId}`),
        };
        let result = await (0, detailSale_service_1.getDailyReportDateForEachDayService)(vehicleQuery, pageNo, model);
        (0, helper_1.default)(res, "Daily Report Date For EachDay", result);
    }
    catch (e) {
        next(new Error(e));
    }
};
exports.getDailyReportDateForEachDayHandler = getDailyReportDateForEachDayHandler;
